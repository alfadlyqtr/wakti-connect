
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CalendarEvent } from "@/types/calendar.types";
import { CheckCircle, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface TaskListProps {
  tasks: CalendarEvent[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Get priority color based on priority value
  const getPriorityColorClass = (priority?: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-amber-500";
      case "normal":
        return "bg-green-500";
      default:
        return "bg-slate-500";
    }
  };

  // Get priority label - using direct English values
  const getPriorityLabel = (priority?: string): string => {
    switch (priority) {
      case "urgent": return "Urgent";
      case "high": return "High";
      case "medium": return "Medium";
      case "normal": return "Normal";
      default: return "Normal";
    }
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/dashboard/tasks/${taskId}`);
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        // Ensure we have a valid priority key, defaulting to 'normal'
        const priorityKey = task.priority || 'normal';
        
        return (
          <div 
            key={task.id}
            className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer"
            onClick={() => handleTaskClick(task.id)}
          >
            <div className="mr-2">
              {task.isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 truncate text-sm">{task.title}</div>
            <Badge className={`ml-2 ${getPriorityColorClass(task.priority)}`}>
              {getPriorityLabel(task.priority)}
            </Badge>
          </div>
        );
      })}
    </div>
  );
};
