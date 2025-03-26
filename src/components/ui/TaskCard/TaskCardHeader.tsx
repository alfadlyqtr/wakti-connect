
import React from "react";
import { TaskPriority } from "@/types/task.types";
import { 
  AlertTriangle, 
  Clock, 
  Repeat
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TaskCardHeaderProps {
  title: string;
  priority: TaskPriority;
  isRecurring?: boolean;
  isCompleted: boolean;
}

export const TaskCardHeader: React.FC<TaskCardHeaderProps> = ({
  title,
  priority,
  isRecurring,
  isCompleted
}) => {
  return (
    <div className="flex flex-col space-y-1.5">
      <div className="flex items-center space-x-2">
        {priority === "urgent" && (
          <AlertTriangle className="text-red-500 h-4 w-4" />
        )}
        {isRecurring && (
          <Repeat className="text-blue-500 h-4 w-4" />
        )}
      </div>
      <h3 className={`text-lg font-semibold line-clamp-2 ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
        {title}
      </h3>
      <div className="flex flex-wrap gap-2 mt-1">
        <Badge variant={
          priority === "urgent" ? "destructive" : 
          priority === "high" ? "destructive" : 
          priority === "medium" ? "outline" : 
          "secondary"
        }>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>
      </div>
    </div>
  );
};
