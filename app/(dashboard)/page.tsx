'use client'

// import { LoaderProfile } from "@/components/shared/LoaderProfile/LoaderProfile";
import { StepConfigUserProvider } from "@/contexts/StepConfigUser/StepConfigUser";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { HandleSteps } from "./components/HandleSteps/HandleSteps";
import { Usuario } from "@prisma/client";
import { UserProvider } from "@/contexts/UserContext/UserContext";
import { Button } from "@/components/ui/button";
import { CrearTareaDialog } from "./components/CrearTarea/CrearTarea";
import { ListaProyectos } from "./components/ListarTareas/ListarTareas";
import { toast } from "sonner";


export default function Home() {
  const { user } = useUser()
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [reload, setReload] = useState(false)
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [infoUser, setInfoUser] = useState<Usuario | null>(null)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    const checkFirstLogin = async () => {
      const response = await fetch('/api/info-user')
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setInfoUser(data)
      setIsFirstVisit(data.firstLogin)
    }

    checkFirstLogin()

     if (reload) {
      checkFirstLogin()
      setReload(false)
     }
  }, [user?.id, reload, user])
  

  // if (!user || !infoUser) {
  //   return (
  //     <LoaderProfile />
  //   )
  // }

  if (isFirstVisit) {
    console.log("[isFirstVisit]", isFirstVisit)
    return (
      <StepConfigUserProvider>
        <HandleSteps onReload={setReload}/>
      </StepConfigUserProvider>
    )
  }

  const handleConfirm = async (data: {
    proyecto: string
    costos: number
    sueldo: number
    horasTrabajadas: number
  }) => {
    console.log("Datos del formulario: ", data)
    setOpenDialog(false)

    try {
      const response = await fetch('/api/crear-tarea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      console.log("Respuesta del servidor: ", result)

      if (result.success) {
        // window.location.reload()
        toast.success("Tarea creada con éxito")
        await new Promise(resolve => setTimeout(resolve, 300));
        window.location.reload()
      }
    } catch (error) {
      console.error("Error al enviar datos: ", error)
    }
  }

  return (
    <UserProvider>
      <div className="">
        <div className="mt-20 flex flex-col items-center">
          <div className="border-2 border-gray-200 rounded-lg p-4 w-[80%]">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Bienvenido {user?.firstName}</h1>
              <Button className="cursor-pointer" onClick={() => setOpenDialog(true)}>Crear tarea</Button>
            </div>
            <p className="text-gray-500 mt-2">¡Estamos felices de tenerte aquí!</p>
          </div>

          <div className="border-2 border-gray-200 rounded-lg p-4 w-[80%] mt-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Tiempos</h1>
            </div>
              <ListaProyectos />
          </div>
        </div>
      </div>

      <CrearTareaDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onSubmit={handleConfirm}
      />
      
    </UserProvider>
  );
}
