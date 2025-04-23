
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Task, TaskStatus } from "@/types/task.types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Tag, CheckCircle, CircleSlash } from "lucide-react";
import { TaskSubtasks } from "./TaskSubtasks";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Badge } from "@/components/ui/badge";

interface TaskDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (id: string, status: string) => void;
  onSubtaskToggle?: (taskId: string, subtaskIndex: number, isCompleted: boolean) => Promise<void> | void;
  refetch?: () => void;
}

export const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({
  open,
  onOpenChange,
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onSubtaskToggle,
  refetch
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const isCompleted = task.status === "completed";
  const formattedDate = task.due_date 
    ? format(new Date(task.due_date), "MMM d, yyyy")
    : null;

  const handleSubtaskToggle = (subtaskIndex: number, isCompleted: boolean) => {
    if (onSubtaskToggle) {
      onSubtaskToggle(task.id, subtaskIndex, isCompleted);
      if (refetch) refetch();
    }
  };

  const handleStatusToggle = () => {
    const newStatus = isCompleted ? "pending" : "completed";
    onStatusChange(task.id, newStatus);
    if (refetch) refetch();
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-200";
      case "normal": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{task.title}</DialogTitle>
          <DialogDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className={getPriorityColor()}>
                {task.priority}
              </Badge>
              <Badge variant={isCompleted ? "default" : "outline"} 
                className={isCompleted ? "bg-green-500" : ""}>
                {isCompleted ? "Completed" : "Pending"}
              </Badge>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {task.description && (
            <div>
              <p className="text-muted-foreground whitespace-pre-line">
                {task.description}
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            {formattedDate && (
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Due: {formattedDate}</span>
                {task.due_time && (
                  <>
                    <Clock className="h-4 w-4 ml-3 mr-2 text-muted-foreground" />
                    <span>At: {task.due_time}</span>
                  </>
                )}
              </div>
            )}
            
            {task.location && (
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{task.location}</span>
              </div>
            )}
          </div>
          
          {task.subtasks && task.subtasks.length > 0 && (
            <TaskSubtasks 
              taskId={task.id} 
              subtasks={task.subtasks}
              onSubtaskToggle={handleSubtaskToggle}
              refetch={refetch}
            />
          )}
        </div>
        
        <div className="flex justify-between mt-4 pt-4 border-t">
          <div className="flex gap-2">
            <Button onClick={onEdit} variant="outline" size="sm">
              Edit
            </Button>
            <Button 
              onClick={handleStatusToggle} 
              variant="outline" 
              size="sm"
              className={isCompleted ? "text-amber-600" : "text-green-600"}
            >
              {isCompleted ? (
                <>
                  <CircleSlash className="mr-1 h-4 w-4" />
                  Mark Pending
                </>
              ) : (
                <>
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Complete
                </>
              )}
            </Button>
          </div>
          
          <Button 
            onClick={() => setShowConfirmDelete(true)}
            variant="ghost" 
            size="sm"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
        
        {showConfirmDelete && (
          <div className="absolute inset-0 bg-background/90 flex items-center justify-center">
            <div className="bg-card p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="font-medium text-lg">Confirm Deletion</h3>
              <p className="text-muted-foreground my-3">
                Are you sure you want to delete this task? This action will archive the task for 10 days before permanent deletion.
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    onDelete();
                    setShowConfirmDelete(false);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
