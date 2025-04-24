
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
import { TaskCardCompletionAnimation } from "@/components/ui/task-card/TaskCardCompletionAnimation";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete, onComplete }: TaskCardProps) {
  const [showCompletion, setShowCompletion] = React.useState(false);
  
  const formattedDueDate = task.due_date 
    ? format(new Date(task.due_date), "MMM d, yyyy")
    : null;
  
  const isOverdue = task.due_date && task.status !== "completed" && 
    new Date(task.due_date) < new Date() && task.status !== "archived";
    
  const handleComplete = async () => {
    setShowCompletion(true);
    await onComplete(task.id);
  };

  return (
    <>
      <Card 
        className={`
          group relative overflow-hidden transition-all duration-200 
          border hover:border-wakti-blue/20
          hover:shadow-[0_8px_16px_-6px_rgba(0,83,195,0.1)]
          hover:-translate-y-0.5
          ${isOverdue ? "border-red-500/50 dark:border-red-500/30" : ""}
          ${task.status === "completed" ? "bg-gray-50/80 dark:bg-gray-900/40" : ""}
          ${task.status === "in-progress" ? "border-l-4 border-l-wakti-blue" : ""}
          ${task.priority === "urgent" ? "border-l-4 border-l-wakti-gold" : ""}
          ${task.priority === "high" ? "border-l-4 border-l-wakti-navy" : ""}
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
                  ${task.priority === "urgent" ? "border-wakti-gold bg-wakti-gold/10 text-wakti-gold" :
                    task.priority === "high" ? "border-wakti-navy bg-wakti-navy/10 text-wakti-navy" :
                    task.priority === "medium" ? "border-wakti-blue/20 bg-wakti-blue/5 text-wakti-blue" :
                    "border-green-200 bg-green-50 text-green-600"}
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
              className="h-8 px-3 hover:bg-wakti-blue/5 border-wakti-blue/20"
            >
              <Edit className="w-3.5 h-3.5 mr-1" /> Edit
            </Button>
            
            {task.status !== "completed" && (
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 px-3 text-green-600 border-green-200 hover:bg-green-50"
                onClick={handleComplete}
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Complete
              </Button>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 ml-auto"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </CardFooter>
      </Card>
      
      <TaskCardCompletionAnimation
        show={showCompletion}
        isAheadOfTime={task.due_date ? new Date(task.due_date) > new Date() : false}
        onAnimationComplete={() => setShowCompletion(false)}
      />
    </>
  );
}
