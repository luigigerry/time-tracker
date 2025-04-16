export type StepConfigUserContextType = {
  infoUser: InfoUserType
  setInfoUser: React.Dispatch<React.SetStateAction<InfoUserType>>
}

type InfoUserType = {
  name: string
}

export type StepConfigUserProviderProps = {
  children: React.ReactNode
}