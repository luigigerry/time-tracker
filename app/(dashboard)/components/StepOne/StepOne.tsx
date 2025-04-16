import { useStepConfig } from "@/hooks/useStepConfig"
import { useState } from "react"

import axios from 'axios'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { StepOneProps } from "./StepOne.types"

export const StepOne = (props: StepOneProps) => {
  const [name, setName] = useState("")
  const { onReload } = props

  const { setInfoUser } = useStepConfig()

  const handleContinue = async () => {
    if (!name) {
      alert("Please enter your name")
      return
    }

    setInfoUser((prevInfoUser) => ({
      ...prevInfoUser,
      name
    }))

    try {
      const response = await axios.post("/api/user", {
        nombre: name
      })

      if (response.status === 201) {
        setInfoUser((prevInfoUser) => ({
          ...prevInfoUser,
          name
        }))

        alert("Name updated successfully")
      }

      onReload()
    } catch (error) {
      console.error("Error updating name:", error)
    }
  }

  return (
    <div>
      <h2 className="text-center font-semibold text-2xl">Add profile details</h2>
      <p className="text-center">Select your name</p>

      <div className="mt-5">
        <h3 className="text-lg my-3 text-center">Add your username</h3>
        <div className="grid gap-4">
          <Input 
            placeholder="Name"
            className="w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mt-6 md:mt-16">
          <Button className="w-full bg-purple-600" onClick={handleContinue}>Continue</Button>
        </div>
      </div>
    </div>
  )
}