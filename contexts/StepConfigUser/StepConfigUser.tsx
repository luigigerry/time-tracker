import { createContext, useState } from "react";
import { StepConfigUserContextType, StepConfigUserProviderProps } from "./StepConfigUser.types";

export const StepConfigUserContext = createContext<StepConfigUserContextType>({
  infoUser: {
    name: ""
  },
  setInfoUser: () => {}
})

export function StepConfigUserProvider({
  children,
}: StepConfigUserProviderProps) {
  const [infoUser, setInfoUser] = useState<StepConfigUserContextType["infoUser"]>({
    name: ""
  })

  const data = {
    infoUser,
    setInfoUser
  }

  return (
    <StepConfigUserContext.Provider value={data}>
      {children}
    </StepConfigUserContext.Provider>
  )
}