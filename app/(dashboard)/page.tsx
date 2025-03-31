import { Clock10 } from "lucide-react";

export default function Home() {
  return (
    <div className="">
      <div className="mt-20 flex flex-col items-center">
        <div className="py-10 text-center justify-center flex flex-col items-center text-gray-400 font-semibold">
          <Clock10 className="h-20 w-20" strokeWidth={1} />
          <p className="font-thin">Start tracking your time.</p>
          <p className="font-thin">Add a project to get started.</p>
        </div>
      </div>
    </div>
  );
}
