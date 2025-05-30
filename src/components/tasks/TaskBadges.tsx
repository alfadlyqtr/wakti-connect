
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Share2, UserCheck, CheckCircle, Clock, AlertTriangle, Bell } from "lucide-react";
import { TaskStatus, TaskPriority } from "@/types/task.types";
import { isBefore, isAfter, isToday, format } from "date-fns";

interface TaskBadgesProps {
  dueDate: Date;
  priority: TaskPriority;
  isShared?: boolean;
  isAssigned?: boolean;
  status?: TaskStatus;
  category?: string;
  completedDate?: Date | null;
  snoozedUntil?: Date | null;
  dueTime?: string | null;
}

export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "in-progress":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    case "late":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    case "snoozed":
      return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
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
    case "normal":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
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

export const TaskCompletionBadge = ({ 
  status, 
  dueDate, 
  completedDate,
  snoozedUntil
}: { 
  status: TaskStatus, 
  dueDate: Date, 
  completedDate?: Date | null,
  snoozedUntil?: Date | null
}) => {
  
  if (status === "snoozed" && snoozedUntil) {
    return (
      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 text-xs">
        <Bell className="h-3 w-3 mr-1" />
        Snoozed until {format(snoozedUntil, 'MMM d')}
      </Badge>
    );
  }
  
  if (status !== "completed") {
    if (status === "in-progress" && isToday(dueDate)) {
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 text-xs">
          <Clock className="h-3 w-3 mr-1" />
          In Progress (Today)
        </Badge>
      );
    } else if (isAfter(new Date(), dueDate)) {
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-500 text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Overdue
        </Badge>
      );
    }
    return null;
  }
  
  if (completedDate) {
    return (
      <Badge variant="outline" className="bg-green-500/10 text-green-500 text-xs">
        <CheckCircle className="h-3 w-3 mr-1" />
        Completed {format(completedDate, 'MMM d')}
      </Badge>
    );
  }

  return null;
};
