import { StepConfigUserContext } from "@/contexts/StepConfigUser/StepConfigUser"
import { useContext } from "react"

export const useStepConfig = () => useContext(StepConfigUserContext)