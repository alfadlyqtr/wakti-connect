
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskPriority, TaskStatus } from "@/types/task.types";
import { TaskCardMenu } from "./TaskCardMenu";

interface TaskCardHeaderProps {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  isRecurring?: boolean;
  isRecurringInstance?: boolean;
  isAssigned?: boolean;
  isShared?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onShare?: (id: string) => void;
  onAssign?: (id: string) => void;
  onSnooze?: (id: string, days: number) => void;
}

export const TaskCardHeader: React.FC<TaskCardHeaderProps> = ({
  id,
  title,
  status,
  priority,
  isRecurring,
  isRecurringInstance,
  isAssigned,
  isShared,
  onEdit,
  onDelete,
  onStatusChange,
  onShare,
  onAssign,
  onSnooze
}) => {
  const statusColors = {
    pending: "bg-amber-500",
    "in-progress": "bg-blue-500",
    completed: "bg-green-500",
    late: "bg-red-500",
    snoozed: "bg-purple-500"
  };

  const priorityColors = {
    urgent: "bg-red-600 hover:bg-red-700",
    high: "bg-red-500 hover:bg-red-600",
    medium: "bg-amber-500 hover:bg-amber-600",
    normal: "bg-green-500 hover:bg-green-600"
  };

  return (
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <CardTitle className="text-lg font-medium line-clamp-2">{title}</CardTitle>
        <TaskCardMenu
          id={id}
          status={status}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onShare={onShare}
          onAssign={onAssign}
          onSnooze={onSnooze}
        />
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge variant="secondary" className={`${statusColors[status]}`}>
          {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        
        <Badge variant="secondary" className={priorityColors[priority]}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>
        
        {isRecurring && (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Recurring
          </Badge>
        )}
        
        {isRecurringInstance && (
          <Badge variant="outline" className="border-purple-500 text-purple-500">
            Instance
          </Badge>
        )}
        
        {isAssigned && (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Assigned
          </Badge>
        )}
        
        {isShared && (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Shared
          </Badge>
        )}
      </div>
    </CardHeader>
  );
};
