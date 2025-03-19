
import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import TimeElapsed from "./TimeElapsed";

interface WorkSessionStatusProps {
  activeWorkSession: any | null;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "PPpp"); // Format: "Jan 1, 2021, 12:00 AM"
};

const WorkSessionStatus: React.FC<WorkSessionStatusProps> = ({ activeWorkSession }) => {
  if (activeWorkSession) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <span className="text-green-600 font-semibold flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Currently Working
          </span>
          <span className="text-sm text-muted-foreground">
            Started: {formatDate(activeWorkSession.start_time)}
          </span>
          <span className="font-medium mt-2">
            Time Elapsed: <TimeElapsed startTimeString={activeWorkSession.start_time} />
          </span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="text-muted-foreground">
      <span className="flex items-center">
        <XCircle className="h-4 w-4 mr-1 text-red-500" />
        Not currently working
      </span>
      <p className="text-sm mt-2">
        Start your work day to track hours and create job cards.
      </p>
    </div>
  );
};

export default WorkSessionStatus;
