
import React from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { TaskStatus } from "@/types/task.types";
import { useTranslation } from "react-i18next";

interface TaskStatusIconProps {
  status: TaskStatus;
}

const TaskStatusIcon = ({ status }: TaskStatusIconProps) => {
  const { t } = useTranslation();
  
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
        t('task.status.completed')
      );
    case "in-progress":
      return createIconWithTitle(
        Clock, 
        "h-5 w-5 text-blue-500", 
        t('task.status.inProgress')
      );
    case "late":
      return createIconWithTitle(
        AlertCircle, 
        "h-5 w-5 text-red-500", 
        t('task.status.late')
      );
    default:
      return createIconWithTitle(
        Clock, 
        "h-5 w-5 text-amber-500", 
        t('task.status.pending')
      );
  }
};

export default TaskStatusIcon;
