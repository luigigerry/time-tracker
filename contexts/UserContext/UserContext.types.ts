import { Proyecto, RegistroHoras, Usuario } from "@prisma/client"
import { ReactNode } from "react"

export type UserContextType = {
  user: Usuario | null
  registroHoras: RegistroHoras[] | null
  projects: Proyecto[] | null
  isLoading: boolean
  reloadUser: () => void
}

export type UserProviderProps = {
  children: ReactNode
}