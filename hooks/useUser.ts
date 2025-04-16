import { UserContext } from "@/contexts/UserContext/UserContext"
import { useContext } from "react"

export const useUserInfo = () => useContext(UserContext)