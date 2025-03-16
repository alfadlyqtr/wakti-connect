
import React from "react";
import { cn } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TaskStatusIcon from "@/components/tasks/TaskStatusIcon";
import TaskBadges, { TaskSharingBadges } from "@/components/tasks/TaskBadges";
import TaskActionsMenu from "@/components/tasks/TaskActionsMenu";
import { formatDate } from "@/utils/formatUtils";
import { TaskStatus, TaskPriority } from "@/types/task.types";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  userRole?: "free" | "individual" | "business";
  isAssigned?: boolean;
  isShared?: boolean;
}

const TaskCard = ({
  id,
  title,
  description,
  dueDate,
  status,
  priority,
  category,
  userRole = "free",
  isAssigned = false,
  isShared = false
}: TaskCardProps) => {
  const isPaidAccount = userRole === "individual" || userRole === "business";

  return (
    <Card className={cn(
      "task-card group transition-all duration-300",
      status === "completed" && "opacity-80",
      "hover:shadow-md hover:border-primary/20"
    )}>
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-2">
          <TaskStatusIcon status={status} />
          <h3 className={cn(
            "font-medium text-base transition-all duration-200",
            status === "completed" && "line-through text-muted-foreground"
          )}>
            {title}
          </h3>
        </div>
        {isPaidAccount ? (
          <div className="flex items-center">
            <TaskSharingBadges isShared={isShared} isAssigned={isAssigned} />
            <TaskActionsMenu 
              status={status} 
              userRole={userRole} 
              isShared={isShared} 
              isAssigned={isAssigned} 
            />
          </div>
        ) : (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 text-xs">
            View Only
          </Badge>
        )}
      </CardHeader>
      
      {description && (
        <CardContent className="p-4 pt-2 pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </CardContent>
      )}
      
      <CardFooter className="p-4 pt-2 flex flex-wrap gap-2 items-center justify-between">
        <TaskBadges 
          status={status} 
          priority={priority} 
          category={category} 
          isShared={isShared} 
          isAssigned={isAssigned} 
        />
        <span className="text-xs text-muted-foreground">
          {formatDate(dueDate)}
        </span>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
