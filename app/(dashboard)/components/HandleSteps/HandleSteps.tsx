import { useState } from "react";
import { HanldeStepsProps } from "./HandleSteps.types";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { StepOne } from "../StepOne/StepOne";

export function HandleSteps(props: HanldeStepsProps) {
  const { onReload } = props
  const [openDialog, setOpenDialog] = useState(true)

  const onCloseDialog = () => {
    onReload(true)
    setOpenDialog(false)
  }

  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="mb-3">
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <StepOne onReload={onCloseDialog}/>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}