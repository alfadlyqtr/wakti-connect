
import React from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { TaskStatus } from "@/types/task.types";
import { useTranslation } from "react-i18next";

interface TaskStatusIconProps {
  status: TaskStatus;
}

const TaskStatusIcon = ({ status }: TaskStatusIconProps) => {
  const { t } = useTranslation();
  
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-green-500" title={t('task.status.completed')} />;
    case "in-progress":
      return <Clock className="h-5 w-5 text-blue-500" title={t('task.status.inProgress')} />;
    case "late":
      return <AlertCircle className="h-5 w-5 text-red-500" title={t('task.status.late')} />;
    default:
      return <Clock className="h-5 w-5 text-amber-500" title={t('task.status.pending')} />;
  }
};

export default TaskStatusIcon;
