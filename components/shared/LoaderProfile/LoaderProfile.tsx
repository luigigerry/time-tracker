import { LoaderCircle } from "lucide-react";

export function LoaderProfile() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-2">
      <LoaderCircle className="animate-spin h-10 w-10" />
      <p>Loading TimeTracker...</p>
    </div>
  )
}