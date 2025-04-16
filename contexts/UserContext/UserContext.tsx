import { useUser } from "@clerk/nextjs";
import { UserContextType, UserProviderProps } from "./UserContext.types";
import { Proyecto, RegistroHoras, Usuario } from "@prisma/client";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: false,
  projects: null,
  registroHoras: null,
  reloadUser: () => {},
})

export function UserProvider({ children }: UserProviderProps) {
  const { user } = useUser()

  const [infoUser, setInfoUser] = useState<Usuario | null>(null)
  const [project, setProject] = useState<Proyecto[] | null>(null)
  const [registroHoras, setRegistrohoras] = useState<RegistroHoras[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserInfo = async () => {
    if (!user) return 

    try {
      setIsLoading(true)
      const response = await fetch('/api/info-user')
      const data = await response.json()
      setInfoUser(data)
      setProject(data.proyectos || [])
      setRegistrohoras(data.registroHoras || [])
    } catch (error) {
      console.error("Error fetching user info:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const reloadUser = () => fetchUserInfo()

  const data = {
    user: infoUser,
    projects: project,
    registroHoras: registroHoras,
    isLoading,
    reloadUser
  }

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>
}