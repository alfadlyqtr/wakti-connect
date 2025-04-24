
import React from "react";
import { Task, TaskStatus } from "@/types/task.types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  Clock, 
  Calendar, 
  MessageCircle, 
  Edit, 
  Trash2,
  CheckCircle
} from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete, onComplete }: TaskCardProps) {
  const formattedDueDate = task.due_date 
    ? format(new Date(task.due_date), "MMM d, yyyy")
    : null;
  
  const isOverdue = task.due_date && task.status !== "completed" && 
    new Date(task.due_date) < new Date() && task.status !== "archived";

  return (
    <Card 
      className={`
        group relative overflow-hidden transition-all duration-200 
        border border-gray-200 hover:border-primary/20
        hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)]
        hover:-translate-y-0.5
        ${isOverdue ? "border-red-500/50 dark:border-red-500/30" : ""}
        ${task.status === "completed" ? "bg-gray-50/80 dark:bg-gray-900/40" : ""}
      `}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <h3 className={`
              font-medium line-clamp-1 pr-6 
              ${task.status === "completed" ? "text-muted-foreground" : ""}
            `}>
              {task.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className={`
                text-xs px-2 py-0.5 rounded-full font-medium
                ${task.status === "completed" ? "bg-green-500/10 text-green-600 dark:text-green-400" : 
                  task.status === "in-progress" ? "bg-wakti-blue/10 text-wakti-blue dark:text-blue-400" : 
                  "bg-gray-500/10 text-gray-600 dark:text-gray-400"}
              `}>
                {task.status === "in-progress" ? "In Progress" : task.status}
              </Badge>
              <Badge variant="outline" className={`
                text-xs px-2 py-0.5 rounded-full font-medium border
                ${task.priority === "urgent" ? "border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400" :
                  task.priority === "high" ? "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400" :
                  task.priority === "medium" ? "border-wakti-blue/20 bg-wakti-blue/5 text-wakti-blue dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400" :
                  "border-green-200 bg-green-50 text-green-600 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400"}
              `}>
                {task.priority}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {task.description && (
          <p className={`
            text-sm line-clamp-2 mb-3 
            ${task.status === "completed" ? "text-muted-foreground/70" : "text-muted-foreground"}
          `}>
            {task.description}
          </p>
        )}
        
        <div className="text-xs text-muted-foreground space-y-1">
          {formattedDueDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span className={isOverdue ? "text-red-500 font-medium" : ""}>
                {formattedDueDate}
                {task.due_time && ` at ${task.due_time}`}
              </span>
            </div>
          )}
          
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>
                {task.subtasks.filter(st => st.is_completed).length} of {task.subtasks.length} subtasks completed
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(task)}
            className="h-8 px-3 hover:bg-primary/5"
          >
            <Edit className="w-3.5 h-3.5 mr-1" /> Edit
          </Button>
          
          {task.status !== "completed" && (
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 px-3 text-green-600 border-green-200 hover:bg-green-50 dark:border-green-500/20 dark:hover:bg-green-500/10"
              onClick={() => onComplete(task.id)}
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Complete
            </Button>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 ml-auto"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
