
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, ListTodo, CalendarClock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ParsedTaskInfo } from "@/hooks/ai/utils/taskParser";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskConfirmationCardProps {
  taskInfo: ParsedTaskInfo;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TaskConfirmationCard: React.FC<TaskConfirmationCardProps> = ({
  taskInfo,
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500/20 text-red-600";
      case "high": return "bg-orange-500/20 text-orange-600";
      case "medium": return "bg-yellow-500/20 text-yellow-600";
      case "normal": return "bg-blue-500/20 text-blue-600";
      default: return "bg-blue-500/20 text-blue-600";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No due date";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) return "Today";
    if (date.getTime() === tomorrow.getTime()) return "Tomorrow";
    
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto border-primary/20 animate-in fade-in-50 duration-300 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <ListTodo className="h-4 w-4" />
          Ready to Create This Task
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div>
          <h3 className="font-semibold text-base">{taskInfo.title}</h3>
          {taskInfo.description && (
            <p className="text-sm text-muted-foreground mt-1">{taskInfo.description}</p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 items-center text-xs">
          <Badge variant="outline" className={cn("py-1", getPriorityColor(taskInfo.priority))}>
            {taskInfo.priority.charAt(0).toUpperCase() + taskInfo.priority.slice(1)} Priority
          </Badge>
          
          <Badge variant="outline" className="py-1 flex items-center gap-1">
            <CalendarClock className="h-3 w-3" />
            {formatDate(taskInfo.dueDate)}
            {taskInfo.dueTime && ` at ${taskInfo.dueTime}`}
          </Badge>
        </div>
        
        {taskInfo.subtasks && taskInfo.subtasks.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">Subtasks ({taskInfo.subtasks.length})</h4>
              <ScrollArea className="max-h-28 pr-2">
                <ul className="space-y-1">
                  {taskInfo.subtasks.map((subtask, index) => (
                    <li key={index} className="text-sm flex gap-2 items-start">
                      <div className="h-4 w-4 mt-0.5 rounded-full border flex items-center justify-center flex-shrink-0">
                        <Check className="h-2.5 w-2.5 text-muted-foreground/50" />
                      </div>
                      <span>{subtask}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          </>
        )}
        
        {taskInfo.hasTimeConstraint && (
          <div className="flex items-center gap-2 text-xs text-amber-500 mt-2">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>This task has a time constraint</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2 pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          size="sm" 
          onClick={onConfirm}
          disabled={isLoading}
          className="gap-1 flex-1"
        >
          {isLoading ? (
            <>
              <Clock className="h-3.5 w-3.5 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Check className="h-3.5 w-3.5" />
              Create Task
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
