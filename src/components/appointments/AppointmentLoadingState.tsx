
import React from "react";
import { Loader2 } from "lucide-react";

interface AppointmentLoadingStateProps {
  message: string;
}

const AppointmentLoadingState: React.FC<AppointmentLoadingStateProps> = ({ message }) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 animate-spin text-wakti-blue mr-2" />
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentLoadingState;
