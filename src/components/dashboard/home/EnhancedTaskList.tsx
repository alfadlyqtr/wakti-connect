
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CalendarEvent } from "@/types/calendar.types";
import { CheckCircle, Circle, ArrowRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SwipeableList } from "@/components/ui/mobile/SwipeableList";
import { platformHapticFeedback } from "@/utils/hapticFeedback";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/useIsMobile";

interface EnhancedTaskListProps {
  tasks: CalendarEvent[];
  onCompleteTask?: (taskId: string) => Promise<void>;
  onDeleteTask?: (taskId: string) => Promise<void>;
}

export const EnhancedTaskList: React.FC<EnhancedTaskListProps> = ({ 
  tasks,
  onCompleteTask,
  onDeleteTask
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

  // Explicitly hardcode English values
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
  
  const handleCompleteTask = async (task: CalendarEvent, index: number) => {
    if (!onCompleteTask) return;
    
    platformHapticFeedback('success');
    try {
      await onCompleteTask(task.id);
      toast({
        title: "Task completed",
        description: `"${task.title}" has been marked as complete.`,
      });
    } catch (error) {
      console.error("Error completing task:", error);
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTask = async (task: CalendarEvent, index: number) => {
    if (!onDeleteTask) return;
    
    platformHapticFeedback('error');
    try {
      await onDeleteTask(task.id);
      toast({
        title: "Task deleted",
        description: `"${task.title}" has been deleted.`,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isMobile && (onCompleteTask || onDeleteTask)) {
    return (
      <div className="space-y-2">
        <SwipeableList
          items={tasks}
          keyExtractor={(task) => task.id}
          onComplete={onCompleteTask ? handleCompleteTask : undefined}
          onDelete={onDeleteTask ? handleDeleteTask : undefined}
          renderItem={(task) => (
            <div 
              className="flex items-center p-3 rounded-md bg-background border"
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
          )}
          completeLabel={<CheckCircle className="h-5 w-5 text-white" />}
          deleteLabel={<Trash2 className="h-5 w-5 text-white" />}
          disableSwipe={false}
        />
      </div>
    );
  }

  // Fallback to standard list for desktop
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

export default EnhancedTaskList;
