
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
  MessageCircle,
  Stamp
} from "lucide-react";
import { format } from "date-fns";

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
      className={`group relative overflow-hidden transition-all duration-200 
        hover:shadow-lg hover:-translate-y-1 
        ${isOverdue ? "border-red-500" : ""}
        ${task.status === "completed" ? "bg-gray-50/50 dark:bg-gray-900/50" : ""}
      `}
    >
      {task.status === "completed" && (
        <div className="absolute -right-8 -top-8 z-10">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 flex items-center justify-center transform rotate-45">
              <Stamp className="h-12 w-12 text-green-500/20" strokeWidth={1} />
            </div>
          </div>
        </div>
      )}
      
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className={`font-medium line-clamp-1 pr-6 ${task.status === "completed" ? "text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className={`
                ${task.status === "completed" ? "bg-green-500" : 
                  task.status === "in-progress" ? "bg-blue-500" : 
                  "bg-slate-500"} text-white
              `}>
                {task.status === "in-progress" ? "In Progress" : task.status}
              </Badge>
              <Badge variant="outline" className={`
                ${task.priority === "urgent" ? "border-red-500 text-red-600 bg-red-50 dark:bg-red-900/10" :
                  task.priority === "high" ? "border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-900/10" :
                  task.priority === "medium" ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/10" :
                  "border-green-500 text-green-600 bg-green-50 dark:bg-green-900/10"}
              `}>
                {task.priority}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {task.description && (
          <p className={`text-sm line-clamp-2 mb-3 ${task.status === "completed" ? "text-muted-foreground" : "text-muted-foreground"}`}>
            {task.description}
          </p>
        )}
        
        <div className="text-xs text-muted-foreground">
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
      
      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(task)}
            className="transition-colors"
          >
            <Edit className="w-4 h-4 mr-1" /> Edit
          </Button>
          
          {task.status !== "completed" && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
              onClick={() => onComplete(task.id)}
            >
              <CheckCircle className="w-4 h-4 mr-1" /> Complete
            </Button>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 ml-auto"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
