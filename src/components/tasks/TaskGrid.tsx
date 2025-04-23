
import React from "react";
import { Task } from "@/types/task.types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Edit, 
  Trash, 
  AlertCircle,
  ArrowUpCircle
} from "lucide-react";
import { format, isToday, isPast } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskGridProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  isLoading?: boolean;
  pendingTaskId?: string | null;
}

export function TaskGrid({
  tasks,
  onEdit,
  onDelete,
  onComplete,
  isLoading = false,
  pendingTaskId = null
}: TaskGridProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No tasks found.</p>
      </div>
    );
  }

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "urgent": return "bg-red-500 hover:bg-red-600";
      case "high": return "bg-orange-500 hover:bg-orange-600";
      case "medium": return "bg-yellow-500 hover:bg-yellow-600";
      case "normal": return "bg-blue-500 hover:bg-blue-600";
      default: return "bg-blue-500 hover:bg-blue-600";
    }
  };

  const getPriorityBadge = (priority: string): JSX.Element => {
    const colorClass = {
      urgent: "bg-red-500/10 text-red-600 border-red-600/20",
      high: "bg-orange-500/10 text-orange-600 border-orange-600/20",
      medium: "bg-yellow-500/10 text-yellow-600 border-yellow-600/20",
      normal: "bg-blue-500/10 text-blue-600 border-blue-600/20",
    }[priority] || "bg-blue-500/10 text-blue-600 border-blue-600/20";

    return (
      <Badge className={`${colorClass} rounded-md`} variant="outline">
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (task: Task): JSX.Element | null => {
    if (task.status === "completed") {
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-600/20 rounded-md" variant="outline">
          Completed
        </Badge>
      );
    }
    
    if (task.status === "in-progress") {
      return (
        <Badge className="bg-sky-500/10 text-sky-600 border-sky-600/20 rounded-md" variant="outline">
          In Progress
        </Badge>
      );
    }
    
    if (task.status === "snoozed") {
      // Handle snoozed tasks - only if the property exists
      const snoozeCount = task.snooze_count || 0;
      return (
        <Badge className="bg-purple-500/10 text-purple-600 border-purple-600/20 rounded-md" variant="outline">
          Snoozed {snoozeCount > 0 ? `(${snoozeCount})` : ""}
        </Badge>
      );
    }
    
    if (task.due_date && isPast(new Date(task.due_date)) && task.status !== "completed") {
      return (
        <Badge className="bg-red-500/10 text-red-600 border-red-600/20 rounded-md" variant="outline">
          Late
        </Badge>
      );
    }
    
    if (task.due_date && isToday(new Date(task.due_date))) {
      return (
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-600/20 rounded-md" variant="outline">
          Today
        </Badge>
      );
    }
    
    return null;
  };

  const renderTaskBadges = (task: Task): React.ReactNode => {
    const badges = [];
    
    // Special features badges - don't render if property doesn't exist
    if (task.is_recurring) {
      badges.push(
        <Badge key="recurring" className="bg-indigo-500/10 text-indigo-600 border-indigo-600/20 rounded-md" variant="outline">
          Recurring
        </Badge>
      );
    }
    
    if (task.is_recurring_instance) {
      badges.push(
        <Badge key="instance" className="bg-violet-500/10 text-violet-600 border-violet-600/20 rounded-md" variant="outline">
          Instance
        </Badge>
      );
    }
    
    // Only show if we have badges
    if (badges.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {badges}
      </div>
    );
  };

  const getFormattedDateTime = (task: Task): string => {
    if (!task.due_date) return "No due date";
    
    const dueDate = new Date(task.due_date);
    const dateFormatted = format(dueDate, "MMM d, yyyy");
    
    if (task.due_time) {
      return `${dateFormatted} at ${task.due_time}`;
    }
    
    return dateFormatted;
  };

  // Only show snoozed until if the property exists
  const renderSnoozedUntil = (task: Task): React.ReactNode => {
    if (task.status === "snoozed" && task.snoozed_until) {
      return (
        <div className="text-sm text-muted-foreground mt-1">
          Snoozed until: {format(new Date(task.snoozed_until), "MMM d, yyyy")}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <Card key={task.id} className="overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <h3 className="font-semibold leading-tight text-lg line-clamp-2">
                {task.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {getPriorityBadge(task.priority)}
                {getStatusBadge(task)}
              </div>
              {renderTaskBadges(task)}
            </div>
          </CardHeader>
          
          <CardContent className="pb-6">
            {task.description && (
              <div className="mt-2 text-sm text-muted-foreground line-clamp-3">
                {task.description}
              </div>
            )}
            
            <div className="flex items-center mt-3 text-sm">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{getFormattedDateTime(task)}</span>
            </div>
            
            {renderSnoozedUntil(task)}
            
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-1">Subtasks</div>
                <div className="space-y-1">
                  {task.subtasks.slice(0, 3).map((subtask, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className={cn(
                        "w-4 h-4 mr-2 rounded-full border",
                        subtask.is_completed ? "bg-green-500 border-green-500" : "border-gray-400"
                      )} />
                      <span className={cn(
                        "line-clamp-1",
                        subtask.is_completed ? "line-through text-muted-foreground" : ""
                      )}>
                        {subtask.content}
                      </span>
                    </div>
                  ))}
                  
                  {task.subtasks.length > 3 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      +{task.subtasks.length - 3} more subtasks
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 mt-4">
              {task.status !== "completed" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onComplete(task.id)}
                  disabled={isLoading && pendingTaskId === task.id}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(task)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onDelete(task.id)}
                disabled={isLoading && pendingTaskId === task.id}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
