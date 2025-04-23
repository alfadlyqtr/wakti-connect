import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Task, TaskStatus, SubTask } from "@/types/task.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Trash2, 
  Edit, 
  AlertCircle, 
  AlarmClock,
} from "lucide-react";
import { format, formatDistance } from "date-fns";
import { TaskSubtasks } from "./TaskSubtasks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: TaskStatus) => void;
  onSubtaskToggle?: (subtaskIndex: number, isCompleted: boolean) => void;
  refetch?: () => void;
}

export function TaskDetailDialog({
  open,
  onOpenChange,
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onSubtaskToggle,
  refetch
}: TaskDetailDialogProps) {
  const isCompleted = task.status === "completed";
  const isOverdue = !isCompleted && 
    task.due_date && 
    new Date(task.due_date) < new Date() && 
    task.status !== "archived" &&
    task.status !== "snoozed";

  // Get priority color and label
  const getPriorityColor = () => {
    switch (task.priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-300";
      case "high": return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium": return "bg-blue-100 text-blue-800 border-blue-300";
      default: return "bg-green-100 text-green-800 border-green-300";
    }
  };

  const getPriorityLabel = () => {
    return task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
  };

  // Get status color and label
  const getStatusColor = () => {
    switch (task.status) {
      case "completed": return "bg-green-500 text-white";
      case "in-progress": return "bg-blue-500 text-white";
      case "pending": return "bg-yellow-500 text-white";
      case "snoozed": return "bg-purple-500 text-white";
      case "archived": return "bg-gray-500 text-white";
      case "late": return "bg-red-500 text-white";
      default: return "bg-slate-500 text-white";
    }
  };
  
  const getStatusLabel = () => {
    return task.status === "in-progress" ? "In Progress" : 
      task.status.charAt(0).toUpperCase() + task.status.slice(1);
  };
  
  // Format date for display
  const formattedDueDate = task.due_date 
    ? format(new Date(task.due_date), "MMMM d, yyyy")
    : null;
    
  const handleSubtaskToggle = (subtaskIndex: number, isCompleted: boolean) => {
    if (onSubtaskToggle) {
      onSubtaskToggle(subtaskIndex, isCompleted);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{task.title}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {/* Status and Priority */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor()}>{getStatusLabel()}</Badge>
            <Badge variant="outline" className={getPriorityColor()}>
              {getPriorityLabel()} Priority
            </Badge>
            {isOverdue && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                Overdue
              </Badge>
            )}
            {task.is_recurring && (
              <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-300">
                <AlarmClock className="h-3.5 w-3.5 mr-1" /> Recurring
              </Badge>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <h3 className="font-medium mb-1">Description</h3>
              <p className="text-muted-foreground whitespace-pre-line text-sm">
                {task.description}
              </p>
            </div>
          )}

          {/* Due Date & Time */}
          {task.due_date && (
            <div>
              <h3 className="font-medium mb-1">Due Date</h3>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className={isOverdue ? "text-red-500 font-medium" : ""}>
                  {formattedDueDate}
                </span>
                {task.due_time && (
                  <>
                    <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                    <span>{task.due_time}</span>
                  </>
                )}
              </div>
              {isOverdue && (
                <p className="text-xs text-red-500 mt-1">
                  Overdue by {formatDistance(new Date(), new Date(task.due_date))}
                </p>
              )}
            </div>
          )}

          {/* Subtasks Section */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div>
              <TaskSubtasks
                taskId={task.id}
                subtasks={task.subtasks}
                onSubtaskToggle={handleSubtaskToggle}
                refetch={refetch}
              />
            </div>
          )}

          {/* Status Information */}
          {task.completed_at && (
            <div className="text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Completed {formatDistance(new Date(task.completed_at), new Date(), { addSuffix: true })}
              </span>
            </div>
          )}
          {task.snoozed_until && (
            <div className="text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <AlarmClock className="h-4 w-4 text-purple-500" />
                Snoozed until {format(new Date(task.snoozed_until), "MMM d, yyyy")}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <div className="space-x-2">
              {!isCompleted && onStatusChange && (
                <Button 
                  variant="outline" 
                  className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                  onClick={() => onStatusChange("completed")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" /> 
                  Mark Complete
                </Button>
              )}
              {onEdit && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={onEdit}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit task</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            {onDelete && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={onDelete}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete task</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
