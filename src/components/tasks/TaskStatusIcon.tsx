
import React from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { TaskStatus } from "@/types/task.types";

interface TaskStatusIconProps {
  status: TaskStatus;
}

const TaskStatusIcon = ({ status }: TaskStatusIconProps) => {
  // Helper function to create icon with accessible title
  const createIconWithTitle = (Icon: any, className: string, titleText: string) => {
    return (
      <span className="relative inline-block" title={titleText} aria-label={titleText}>
        <Icon className={className} />
      </span>
    );
  };
  
  switch (status) {
    case "completed":
      return createIconWithTitle(
        CheckCircle2, 
        "h-5 w-5 text-green-500", 
        "Completed"
      );
    case "in-progress":
      return createIconWithTitle(
        Clock, 
        "h-5 w-5 text-blue-500", 
        "In Progress"
      );
    case "late":
      return createIconWithTitle(
        AlertCircle, 
        "h-5 w-5 text-red-500", 
        "Late"
      );
    default:
      return createIconWithTitle(
        Clock, 
        "h-5 w-5 text-amber-500", 
        "Pending"
      );
  }
};

export default TaskStatusIcon;
