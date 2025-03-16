
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TaskActionsMenu from "@/components/tasks/TaskActionsMenu";
import TaskStatusIcon from "@/components/tasks/TaskStatusIcon";
import TaskBadges from "@/components/tasks/TaskBadges";
import { RecurringBadge } from "@/components/ui/RecurringBadge";
import { TaskPriority, TaskStatus } from "@/types/task.types";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
  priority: TaskPriority;
  category?: string;
  userRole: "free" | "individual" | "business" | null;
  isAssigned?: boolean;
  isShared?: boolean;
  isRecurring?: boolean;
  recurringFrequency?: string;
  isRecurringInstance?: boolean;
}

const TaskCard = ({
  id,
  title,
  description,
  dueDate,
  status,
  priority,
  category,
  userRole,
  isAssigned = false,
  isShared = false,
  isRecurring = false,
  recurringFrequency,
  isRecurringInstance = false
}: TaskCardProps) => {
  return (
    <Card className="border-border/40 shadow-sm hover:shadow transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
        <div className="space-y-1 w-5/6">
          <div className="flex items-center gap-2 flex-wrap">
            <TaskStatusIcon status={status} />
            {category && (
              <Badge variant="outline" className="font-normal">
                {category}
              </Badge>
            )}
            {(isRecurring || isRecurringInstance) && (
              <RecurringBadge 
                frequency={recurringFrequency} 
                isRecurringInstance={isRecurringInstance} 
              />
            )}
          </div>
          <h3 className="text-base font-semibold leading-tight">{title}</h3>
        </div>
        <TaskActionsMenu id={id} userRole={userRole} status={status} />
      </CardHeader>
      
      <CardContent className="pb-3">
        {description && (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        <TaskBadges 
          dueDate={dueDate} 
          priority={priority} 
          isAssigned={isAssigned} 
          isShared={isShared}
        />
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
