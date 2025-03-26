
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskPriority, TaskStatus, SubTask } from "@/types/task.types";
import { formatDistanceToNow, isPast, addDays, parseISO, format, isValid } from "date-fns";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  CalendarIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  PauseIcon,
  PenIcon,
  TrashIcon,
  MoreVertical,
  CheckIcon,
  PlayIcon,
  BellOff,
  Share2Icon,
  UsersIcon,
  Plus,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { formatTimeString } from "@/utils/dateTimeFormatter";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  dueTime?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  userRole: "free" | "individual" | "business" | "staff" | null;
  isAssigned?: boolean;
  isShared?: boolean;
  subtasks?: SubTask[];
  completedDate?: Date | null;
  isRecurring?: boolean;
  isRecurringInstance?: boolean;
  snoozeCount?: number;
  snoozedUntil?: Date | null;
  delegatedEmail?: string | null;
  assigneeId?: string | null;
  refetch?: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onShare?: (id: string) => void;
  onAssign?: (id: string) => void;
  onSnooze?: (id: string, days: number) => void;
  onSubtaskToggle?: (taskId: string, subtaskIndex: number, isCompleted: boolean) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  dueDate,
  dueTime,
  status,
  priority,
  userRole,
  isAssigned,
  isShared,
  subtasks = [],
  completedDate,
  isRecurring,
  isRecurringInstance,
  snoozeCount = 0,
  snoozedUntil,
  delegatedEmail,
  assigneeId,
  refetch,
  onEdit,
  onDelete,
  onStatusChange,
  onShare,
  onAssign,
  onSnooze,
  onSubtaskToggle
}) => {
  const [showAllSubtasks, setShowAllSubtasks] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isSubmittingSubtask, setIsSubmittingSubtask] = useState(false);
  const hasSubtasks = subtasks && subtasks.length > 0;
  const completedSubtasks = subtasks.filter(subtask => subtask.is_completed).length;
  const subtaskCompletionPercentage = hasSubtasks 
    ? Math.round((completedSubtasks / subtasks.length) * 100) 
    : 0;
  
  const isOverdue = status !== 'completed' && status !== 'snoozed' && isPast(dueDate) && dueDate.getTime() < new Date().getTime();
  
  const priorityColors = {
    urgent: "bg-red-600 hover:bg-red-700",
    high: "bg-red-500 hover:bg-red-600",
    medium: "bg-amber-500 hover:bg-amber-600",
    normal: "bg-green-500 hover:bg-green-600"
  };
  
  const statusColors = {
    pending: "bg-amber-500",
    "in-progress": "bg-blue-500",
    completed: "bg-green-500",
    late: "bg-red-500",
    snoozed: "bg-purple-500"
  };

  const formatDueDate = () => {
    if (!isValid(dueDate)) return "Invalid date";
    
    if (isPast(dueDate) && status !== 'completed') {
      return `Overdue: ${formatDistanceToNow(dueDate, { addSuffix: true })}`;
    }
    
    return formatDistanceToNow(dueDate, { addSuffix: true });
  };

  const formatSubtaskDueDate = (dueDate: string | null | undefined, dueTime: string | null | undefined) => {
    if (!dueDate) return null;
    
    try {
      const date = parseISO(dueDate);
      const formattedDate = format(date, 'MMM d');
      
      if (dueTime) {
        return `${formattedDate}, ${formatTimeString(dueTime)}`;
      }
      
      return formattedDate;
    } catch (error) {
      console.error("Error formatting subtask due date:", error, dueDate);
      return null;
    }
  };
  
  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    
    try {
      setIsSubmittingSubtask(true);
      
      const { data, error } = await supabase
        .from('todo_items')
        .insert({
          task_id: id,
          content: newSubtask.trim(),
          is_completed: false
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Subtask added",
        description: "Your subtask has been added successfully."
      });
      
      setNewSubtask("");
      setIsAddingSubtask(false);
      
      setTimeout(() => {
        if (refetch) {
          refetch();
        } else {
          window.location.reload();
        }
      }, 300);
      
    } catch (error) {
      console.error("Error adding subtask:", error);
      toast({
        title: "Error",
        description: "Failed to add subtask. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingSubtask(false);
    }
  };
  
  const [isClaimingTask, setIsClaimingTask] = useState(false);
  
  const handleClaimTask = async () => {
    try {
      setIsClaimingTask(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to claim tasks",
          variant: "destructive"
        });
        return;
      }
      
      const { claimDelegatedTask } = await import('@/services/task/claimDelegatedTask');
      
      const success = await claimDelegatedTask(id);
      
      if (success) {
        toast({
          title: "Task claimed successfully",
          description: "This task is now assigned to you"
        });
        
        if (typeof refetch === 'function') {
          refetch();
        } else {
          setTimeout(() => window.location.reload(), 500);
        }
      }
    } catch (error) {
      console.error("Error claiming task:", error);
      toast({
        title: "Failed to claim task",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsClaimingTask(false);
    }
  };
  
  const isDelegatedViaEmail = !!delegatedEmail && !assigneeId;

  return (
    <Card className={`border-l-4 ${isOverdue ? 'border-l-red-500' : `border-l-${priorityColors[priority].split(' ')[0]}`}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium line-clamp-2">{title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              {status !== 'completed' && (
                <DropdownMenuItem onClick={() => onStatusChange(id, 'completed')}>
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>Mark Complete</span>
                </DropdownMenuItem>
              )}
              
              {status !== 'in-progress' && status !== 'completed' && (
                <DropdownMenuItem onClick={() => onStatusChange(id, 'in-progress')}>
                  <PlayIcon className="mr-2 h-4 w-4 text-blue-500" />
                  <span>Mark In Progress</span>
                </DropdownMenuItem>
              )}
              
              {status !== 'pending' && status !== 'completed' && (
                <DropdownMenuItem onClick={() => onStatusChange(id, 'pending')}>
                  <PauseIcon className="mr-2 h-4 w-4 text-amber-500" />
                  <span>Mark Pending</span>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => onEdit(id)}>
                <PenIcon className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => onDelete(id)} className="text-destructive">
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {onShare && userRole !== 'free' && !isShared && (
                <DropdownMenuItem onClick={() => onShare(id)}>
                  <Share2Icon className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
              )}
              
              {onAssign && userRole === 'business' && !isAssigned && (
                <DropdownMenuItem onClick={() => onAssign(id)}>
                  <UsersIcon className="mr-2 h-4 w-4" />
                  <span>Assign</span>
                </DropdownMenuItem>
              )}
              
              {onSnooze && status !== 'completed' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Snooze For</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onSnooze(id, 1)}>
                    <BellOff className="mr-2 h-4 w-4" />
                    <span>1 Day</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSnooze(id, 3)}>
                    <BellOff className="mr-2 h-4 w-4" />
                    <span>3 Days</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSnooze(id, 7)}>
                    <BellOff className="mr-2 h-4 w-4" />
                    <span>1 Week</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary" className={`${statusColors[status]}`}>
            {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          
          <Badge variant="secondary" className={priorityColors[priority]}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
          
          {isRecurring && (
            <Badge variant="outline" className="border-blue-500 text-blue-500">
              Recurring
            </Badge>
          )}
          
          {isRecurringInstance && (
            <Badge variant="outline" className="border-purple-500 text-purple-500">
              Instance
            </Badge>
          )}
          
          {isAssigned && (
            <Badge variant="outline" className="border-green-500 text-green-500">
              Assigned
            </Badge>
          )}
          
          {isShared && (
            <Badge variant="outline" className="border-blue-500 text-blue-500">
              Shared
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        {description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
        )}
        
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {formatDueDate()}
              {dueTime && (
                <span className="font-medium ml-1">at {formatTimeString(dueTime)}</span>
              )}
            </span>
          </div>
          
          {status === 'snoozed' && snoozedUntil && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <BellOff className="h-4 w-4" />
              <span>
                Snoozed until {format(snoozedUntil, 'MMM d')}
                {snoozeCount > 1 && ` (${snoozeCount} times)`}
              </span>
            </div>
          )}
        </div>
        
        {hasSubtasks && (
          <div className="mt-4">
            <Collapsible
              open={showAllSubtasks}
              onOpenChange={setShowAllSubtasks}
              className="border rounded-md p-2"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Subtasks ({completedSubtasks}/{subtasks.length})
                  </span>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    {showAllSubtasks ? "Hide" : "Show All"}
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{subtaskCompletionPercentage}%</span>
                </div>
                <Progress value={subtaskCompletionPercentage} className="h-2" />
              </div>
              
              <div className="space-y-2">
                {subtasks.slice(0, 2).map((subtask, index) => (
                  <div key={subtask.id || index} className="flex items-start gap-2 text-sm">
                    <Checkbox 
                      checked={subtask.is_completed} 
                      onCheckedChange={(checked) => 
                        onSubtaskToggle && onSubtaskToggle(id, index, checked as boolean)
                      }
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className={`${subtask.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                        {subtask.content}
                        {(subtask.due_date || subtask.due_time) && (
                          <span className="text-xs text-muted-foreground ml-2">
                            {formatSubtaskDueDate(subtask.due_date, subtask.due_time)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <CollapsibleContent className="space-y-2 mt-2">
                {subtasks.slice(2).map((subtask, index) => (
                  <div key={subtask.id || (index + 2)} className="flex items-start gap-2 text-sm">
                    <Checkbox 
                      checked={subtask.is_completed} 
                      onCheckedChange={(checked) => 
                        onSubtaskToggle && onSubtaskToggle(id, index + 2, checked as boolean)
                      }
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className={`${subtask.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                        {subtask.content}
                        {(subtask.due_date || subtask.due_time) && (
                          <span className="text-xs text-muted-foreground ml-2">
                            {formatSubtaskDueDate(subtask.due_date, subtask.due_time)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
              
              {!isAddingSubtask ? (
                <button 
                  onClick={() => setIsAddingSubtask(true)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mt-3 w-full"
                >
                  <Plus className="h-4 w-4" /> Add subtask
                </button>
              ) : (
                <div className="mt-3 space-y-2">
                  <Input 
                    placeholder="Enter subtask"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setIsAddingSubtask(false)}
                      className="text-xs h-8"
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleAddSubtask}
                      disabled={isSubmittingSubtask || !newSubtask.trim()}
                      className="text-xs h-8"
                    >
                      {isSubmittingSubtask ? "Adding..." : "Add"}
                    </Button>
                  </div>
                </div>
              )}
            </Collapsible>
          </div>
        )}
        
        {!hasSubtasks && (
          <div className="mt-4 border rounded-md p-3">
            {!isAddingSubtask ? (
              <button 
                onClick={() => setIsAddingSubtask(true)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground w-full"
              >
                <Plus className="h-4 w-4" /> Add subtask
              </button>
            ) : (
              <div className="space-y-2">
                <Input 
                  placeholder="Enter subtask"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsAddingSubtask(false)}
                    className="text-xs h-8"
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleAddSubtask}
                    disabled={isSubmittingSubtask || !newSubtask.trim()}
                    className="text-xs h-8"
                  >
                    {isSubmittingSubtask ? "Adding..." : "Add"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {isDelegatedViaEmail && (
          <div className="mt-3 mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-dashed border-blue-300 text-blue-500 hover:text-blue-700"
              onClick={handleClaimTask}
              disabled={isClaimingTask}
            >
              {isClaimingTask ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Claiming Task...
                </>
              ) : (
                <>
                  <CheckCircle2Icon className="mr-2 h-4 w-4" /> 
                  Claim This Task
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 pb-3">
        <div className="flex justify-between w-full">
          <div className="flex gap-1">
            {status !== "completed" ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusChange(id, "completed")}
                className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
              >
                <CheckIcon className="h-4 w-4 mr-1" /> 
                Complete
              </Button>
            ) : (
              <div className="flex items-center text-xs text-muted-foreground">
                <CheckCircle2Icon className="h-4 w-4 mr-1 text-green-500" />
                Completed {completedDate && format(completedDate, 'MMM d')}
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(id)}
            className="text-muted-foreground"
          >
            <PenIcon className="h-4 w-4 mr-1" /> 
            Edit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
