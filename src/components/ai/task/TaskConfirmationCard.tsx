
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ParsedTaskInfo } from "@/hooks/ai/utils/taskParser.types";
import { format } from "date-fns";

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
  // Format due date if it exists
  const formattedDueDate = taskInfo.due_date
    ? typeof taskInfo.due_date === 'string'
      ? taskInfo.due_date
      : format(taskInfo.due_date as Date, 'MMM d, yyyy')
    : null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  // Function to render nested subtasks recursively
  const renderSubtasks = (subtasks: any[], level = 0) => {
    return (
      <ul className={`text-xs ${level > 0 ? 'pl-3 mt-1' : 'pl-5'} space-y-1`}>
        {subtasks.map((subtask, index) => {
          if (typeof subtask === 'string') {
            return (
              <li key={index} className="list-disc text-muted-foreground">
                {subtask}
              </li>
            );
          } else if (subtask && typeof subtask === 'object') {
            // This is a group/nested subtask
            return (
              <li key={index} className="mt-1">
                <span className="font-medium">{subtask.title || subtask.content}</span>
                {subtask.subtasks && subtask.subtasks.length > 0 && (
                  renderSubtasks(subtask.subtasks, level + 1)
                )}
              </li>
            );
          }
          return null;
        })}
      </ul>
    );
  };

  return (
    <Card className="border-primary/20 bg-background/95 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex justify-between items-center">
          <span>Create Task</span>
          <Badge variant="outline" className={getPriorityColor(taskInfo.priority)}>
            {taskInfo.priority.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="font-medium text-lg">{taskInfo.title}</div>
        
        {taskInfo.description && (
          <p className="text-sm text-muted-foreground">{taskInfo.description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mt-2">
          {formattedDueDate && (
            <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-muted">
              <Calendar className="h-3 w-3" />
              <span>{formattedDueDate}</span>
              {taskInfo.dueTime && (
                <>
                  <Clock className="h-3 w-3 ml-1" />
                  <span>{taskInfo.dueTime}</span>
                </>
              )}
            </div>
          )}
          
          {taskInfo.location && (
            <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-muted">
              <MapPin className="h-3 w-3" />
              <span>{taskInfo.location}</span>
            </div>
          )}
        </div>
        
        {taskInfo.subtasks && taskInfo.subtasks.length > 0 && (
          <div className="mt-2">
            <div className="text-xs font-medium mb-1">Subtasks:</div>
            {renderSubtasks(taskInfo.subtasks)}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 justify-end pt-0">
        <Button 
          variant="ghost" 
          onClick={onCancel}
          disabled={isLoading}
          size="sm"
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm}
          disabled={isLoading}
          size="sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Task"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
