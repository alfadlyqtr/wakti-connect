import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Share2, UserCheck, CheckCircle, Clock, AlertTriangle, Bell } from "lucide-react";
import { TaskStatus, TaskPriority } from "@/types/task.types";
import { isBefore, isAfter, isToday, format } from "date-fns";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  
  return (
    <>
      {isShared && (
        <Badge variant="outline" className="mr-2 bg-purple-500/10 text-purple-500 text-xs">
          <Share2 className="h-3 w-3 mr-1" />
          {t("common.shared")}
        </Badge>
      )}
      {isAssigned && (
        <Badge variant="outline" className="mr-2 bg-emerald-500/10 text-emerald-500 text-xs">
          <UserCheck className="h-3 w-3 mr-1" />
          {t("common.assigned")}
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
  const { t } = useTranslation();
  
  if (status === "snoozed" && snoozedUntil) {
    return (
      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 text-xs">
        <Bell className="h-3 w-3 mr-1" />
        {t("task.snoozedUntil")} {format(snoozedUntil, 'MMM d')}
      </Badge>
    );
  }
  
  if (status !== "completed") {
    if (status === "in-progress" && isToday(dueDate)) {
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 text-xs">
          <Clock className="h-3 w-3 mr-1" />
          {t("task.status.inProgress")} ({t("time.today")})
        </Badge>
      );
    } else if (isAfter(new Date(), dueDate)) {
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-500 text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {t("task.overdue")}
        </Badge>
      );
    }
    return null;
  }
  
  if (completedDate) {
    if (isBefore(completedDate, dueDate)) {
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 text-xs">
          <CheckCircle className="h-3 w-3 mr-1" />
          {t("task.completed")} ({t("common.early")})
        </Badge>
      );
    } else if (isAfter(completedDate, dueDate)) {
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 text-xs">
          <CheckCircle className="h-3 w-3 mr-1" />
          {t("task.completed")} ({t("common.late")})
        </Badge>
      );
    }
  }
  
  return (
    <Badge variant="outline" className="bg-green-500/10 text-green-500 text-xs">
      <CheckCircle className="h-3 w-3 mr-1" />
      {t("task.completed")}
    </Badge>
  );
};

const TaskBadges = ({ 
  dueDate, 
  priority, 
  isShared, 
  isAssigned,
  status = "pending",
  category = "personal",
  completedDate = null,
  snoozedUntil = null,
  dueTime = null
}: TaskBadgesProps) => {
  const { t } = useTranslation();
  
  const formattedDate = dueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline" className="text-xs flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        {formattedDate}
        {dueTime && (
          <span className="ml-1 font-medium">{dueTime}</span>
        )}
      </Badge>
      
      <Badge variant="outline" className={cn("text-xs", getPriorityColor(priority))}>
        {t(`task.priority.${priority}`)}
      </Badge>
      
      <TaskSharingBadges isShared={isShared} isAssigned={isAssigned} />
      
      {status && TaskCompletionBadge({ status, dueDate, completedDate, snoozedUntil })}
    </div>
  );
};

export default TaskBadges;
