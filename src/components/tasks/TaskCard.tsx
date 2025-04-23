
import React from "react";
import { Task, TaskStatus } from "@/types/task.types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  CheckCircle, 
  Calendar, 
  AlertCircle, 
  Edit, 
  Trash2,
  MessageCircle
} from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete, onComplete }: TaskCardProps) {
  // Format the due date if available
  const formattedDueDate = task.due_date 
    ? format(new Date(task.due_date), "MMM d, yyyy")
    : null;
  
  // Determine if task is overdue
  const isOverdue = task.due_date && task.status !== "completed" && 
    new Date(task.due_date) < new Date() && task.status !== "archived";
  
  // Get status color
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white";
      case "in-progress":
        return "bg-blue-500 text-white";
      case "late":
        return "bg-red-500 text-white";
      case "snoozed":
        return "bg-amber-500 text-white";
      case "archived":
        return "bg-gray-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };
  
  // Get priority color
  const getPriorityColor = () => {
    switch (task.priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "normal":
      default:
        return "bg-green-100 text-green-800 border-green-300";
    }
  };

  return (
    <Card className={`overflow-hidden ${isOverdue ? "border-red-500" : ""}`}>
      <CardHeader className="p-3 pb-0 flex flex-row justify-between items-start">
        <div>
          <div className="font-medium line-clamp-1">{task.title}</div>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="secondary" className={getStatusColor(task.status)}>
              {task.status === "in-progress" ? "In Progress" : task.status}
            </Badge>
            <Badge variant="outline" className={getPriorityColor()}>
              {task.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-3">
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="mt-2 text-xs text-muted-foreground">
          {formattedDueDate && (
            <div className="flex items-center gap-1 mb-1">
              <Calendar className="w-3 h-3" />
              <span className={isOverdue ? "text-red-500 font-medium" : ""}>
                {formattedDueDate}
                {task.due_time && ` at ${task.due_time}`}
              </span>
            </div>
          )}
          
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>
                {task.subtasks.filter(st => st.is_completed).length} of {task.subtasks.length} subtasks completed
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(task)}
          >
            <Edit className="w-4 h-4 mr-1" /> Edit
          </Button>
          
          {task.status !== "completed" && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-green-600 border-green-600 hover:bg-green-50"
              onClick={() => onComplete(task.id)}
            >
              <CheckCircle className="w-4 h-4 mr-1" /> Complete
            </Button>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
