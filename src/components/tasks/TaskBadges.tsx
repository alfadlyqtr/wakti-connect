
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Share2, UserCheck } from "lucide-react";
import { TaskStatus, TaskPriority } from "@/types/task.types";

interface TaskBadgesProps {
  dueDate: Date;
  priority: TaskPriority;
  isShared?: boolean;
  isAssigned?: boolean;
  status?: TaskStatus;
  category?: string;
}

export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "in-progress":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    case "late":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    default:
      return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
  }
};

export const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case "urgent":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    case "high":
      return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
    case "medium":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    default:
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
  }
};

export const getCategoryColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case "personal":
      return "bg-wakti-blue/10 text-wakti-blue hover:bg-wakti-blue/20";
    case "shared":
      return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
    case "assigned":
      return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20";
    default:
      return "bg-wakti-blue/10 text-wakti-blue hover:bg-wakti-blue/20";
  }
};

export const TaskSharingBadges = ({ isShared, isAssigned }: { isShared?: boolean; isAssigned?: boolean }) => {
  return (
    <>
      {isShared && (
        <Badge variant="outline" className="mr-2 bg-purple-500/10 text-purple-500 text-xs">
          <Share2 className="h-3 w-3 mr-1" />
          Shared
        </Badge>
      )}
      {isAssigned && (
        <Badge variant="outline" className="mr-2 bg-emerald-500/10 text-emerald-500 text-xs">
          <UserCheck className="h-3 w-3 mr-1" />
          Assigned
        </Badge>
      )}
    </>
  );
};

const TaskBadges = ({ 
  dueDate, 
  priority, 
  isShared, 
  isAssigned,
  status = "pending",
  category = "personal"
}: TaskBadgesProps) => {
  const formattedDate = dueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline" className="text-xs flex items-center">
        {formattedDate}
      </Badge>
      
      <Badge variant="outline" className={cn("text-xs", getPriorityColor(priority))}>
        {priority}
      </Badge>
      
      {category && (
        <Badge variant="outline" className={cn("text-xs", getCategoryColor(category))}>
          {category}
        </Badge>
      )}
      
      <TaskSharingBadges isShared={isShared} isAssigned={isAssigned} />
    </div>
  );
};

export default TaskBadges;
