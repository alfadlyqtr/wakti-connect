
import React, { useState, useCallback, useRef } from "react";
import { Task, TaskStatus } from "@/types/task.types";
import TaskCard from "@/components/ui/task-card/TaskCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useDebouncedRefresh } from "@/hooks/useDebouncedRefresh";

interface TaskGridProps {
  tasks: Task[];
  userRole: "free" | "individual" | "business" | "staff" | null;
  refetch: () => Promise<void>;
  isArchiveView?: boolean;
  onEdit: (task: Task) => void;
  onArchive: (taskId: string, reason: "deleted" | "canceled") => Promise<void>;
  onRestore?: (taskId: string) => Promise<void>;
}

const TaskGrid: React.FC<TaskGridProps> = ({ 
  tasks, 
  userRole, 
  refetch,
  isArchiveView = false,
  onEdit,
  onArchive,
  onRestore
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState<"deleted" | "canceled">("deleted");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Operation lock ref to prevent concurrent operations
  const operationLockRef = useRef(false);
  
  // Local task state for optimistic updates
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  
  // Update local tasks when the props tasks change
  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);
  
  // Debounced refresh with error handling
  const { refresh: debouncedRefetch, isRefreshing } = useDebouncedRefresh(
    async () => {
      try {
        await refetch();
        return true;
      } catch (error) {
        console.error("Error in debounced refresh:", error);
        return false;
      }
    }, 
    500
  );
  
  // Operation lock utility functions
  const acquireLock = useCallback(() => {
    if (operationLockRef.current) {
      return false;
    }
    operationLockRef.current = true;
    return true;
  }, []);
  
  const releaseLock = useCallback(() => {
    operationLockRef.current = false;
  }, []);
  
  // Handler for editing a task
  const handleEditTask = useCallback((taskId: string) => {
    if (!acquireLock()) return;
    
    try {
      const taskToEdit = localTasks.find(task => task.id === taskId);
      if (taskToEdit) {
        onEdit(taskToEdit);
      }
    } finally {
      releaseLock();
    }
  }, [localTasks, onEdit, acquireLock, releaseLock]);

  // Handler for deleting/canceling a task
  const handleDeleteTask = useCallback((taskId: string) => {
    if (!acquireLock()) return;
    
    try {
      setTaskToDelete(taskId);
      setDeleteReason("deleted");
      setShowDeleteDialog(true);
    } finally {
      releaseLock();
    }
  }, [acquireLock, releaseLock]);
  
  // Handler for canceling a task
  const handleCancelTask = useCallback((taskId: string) => {
    if (!acquireLock()) return;
    
    try {
      setTaskToDelete(taskId);
      setDeleteReason("canceled");
      setShowDeleteDialog(true);
    } finally {
      releaseLock();
    }
  }, [acquireLock, releaseLock]);

  // Confirming task deletion/cancellation with optimistic UI update
  const confirmDeleteTask = useCallback(async () => {
    if (!taskToDelete || !acquireLock()) return;
    
    try {
      setIsDeleting(true);
      console.log(`Confirming deletion of task ${taskToDelete} with reason ${deleteReason}`);
      
      // Close the dialog early for better UX
      setShowDeleteDialog(false);
      
      // Optimistic UI update - remove the task from local state immediately
      setLocalTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDelete));
      
      if (isArchiveView) {
        // Permanently delete from archive
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', taskToDelete);
          
        if (error) throw error;
        
        toast({
          title: "Task permanently deleted",
          description: "The task has been permanently removed",
          variant: "success",
        });
      } else {
        // Move to archive
        await onArchive(taskToDelete, deleteReason);
      }
      
      // Refresh in the background without freezing the UI
      await debouncedRefetch();
      
    } catch (error) {
      console.error("Error deleting/archiving task:", error);
      
      // Revert the optimistic update on error
      if (!isArchiveView) {
        await debouncedRefetch();
      }
      
      toast({
        title: "Operation failed",
        description: error instanceof Error ? error.message : "Failed to process task",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setTaskToDelete(null);
      releaseLock();
    }
  }, [taskToDelete, deleteReason, isArchiveView, onArchive, debouncedRefetch, acquireLock, releaseLock]);

  // Handler for changing task status with optimistic UI update
  const handleStatusChange = useCallback(async (taskId: string, newStatus: string) => {
    if (!acquireLock()) return;
    
    try {
      console.log(`Changing status of task ${taskId} to ${newStatus}`);
      
      // Validate the new status is a valid TaskStatus before updating
      const validatedStatus = newStatus as TaskStatus;
      
      // Skip animation for completed tasks if they're being archived
      const skipAnimation = validatedStatus === 'archived' && localTasks.find(task => task.id === taskId)?.status === 'completed';
      
      // Optimistic UI update
      setLocalTasks(prev => 
        prev.map(task => {
          if (task.id === taskId) {
            return { 
              ...task, 
              status: validatedStatus,
              updated_at: new Date().toISOString(),
              completed_at: newStatus === 'completed' ? new Date().toISOString() : task.completed_at
            };
          }
          return task;
        })
      );
      
      let updates: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      // If marking as completed, set the completed_at timestamp
      if (newStatus === 'completed') {
        updates.completed_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);
        
      if (error) throw error;
      
      const statusMessages = {
        'completed': 'Task completed! Great job!',
        'in-progress': 'Task marked as in progress',
        'snoozed': 'Task snoozed',
        'pending': 'Task marked as pending',
      };
      
      if (!skipAnimation) {
        toast({
          title: "Status updated",
          description: statusMessages[newStatus as keyof typeof statusMessages] || `Task marked as ${newStatus}`,
          variant: "success",
        });
      }
      
      // Refresh in the background without freezing the UI
      await debouncedRefetch();
      
    } catch (error) {
      console.error("Error updating task status:", error);
      
      // Revert the optimistic update on error
      await debouncedRefetch();
      
      toast({
        title: "Status update failed",
        description: error instanceof Error ? error.message : "Failed to update task status",
        variant: "destructive",
      });
    } finally {
      releaseLock();
    }
  }, [localTasks, debouncedRefetch, acquireLock, releaseLock]);

  // Handler for snoozing a task with optimistic UI update
  const handleSnoozeTask = useCallback(async (taskId: string, days: number) => {
    if (!acquireLock()) return;
    
    try {
      console.log(`Snoozing task ${taskId} for ${days} days`);
      
      // Calculate the snooze date
      const snoozedUntil = new Date();
      snoozedUntil.setDate(snoozedUntil.getDate() + days);
      
      // Get the current snooze count from local state
      const task = localTasks.find(t => t.id === taskId);
      if (!task) throw new Error("Task not found");
      
      const currentSnoozeCount = task.snooze_count || 0;
      
      // Optimistic UI update
      setLocalTasks(prev => 
        prev.map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              status: 'snoozed' as TaskStatus,
              snoozed_until: snoozedUntil.toISOString(),
              snooze_count: currentSnoozeCount + 1,
              updated_at: new Date().toISOString()
            };
          }
          return task;
        })
      );
      
      const { error } = await supabase
        .from('tasks')
        .update({
          status: 'snoozed',
          snoozed_until: snoozedUntil.toISOString(),
          snooze_count: currentSnoozeCount + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);
        
      if (error) throw error;
      
      toast({
        title: "Task snoozed",
        description: `Task snoozed for ${days} day${days > 1 ? 's' : ''}`,
        variant: "success",
      });
      
      // Refresh in the background without freezing the UI
      await debouncedRefetch();
      
    } catch (error) {
      console.error("Error snoozing task:", error);
      
      // Revert the optimistic update on error
      await debouncedRefetch();
      
      toast({
        title: "Snooze failed",
        description: error instanceof Error ? error.message : "Failed to snooze task",
        variant: "destructive",
      });
    } finally {
      releaseLock();
    }
  }, [localTasks, debouncedRefetch, acquireLock, releaseLock]);

  // Handler for toggling a subtask with optimistic UI update
  const handleSubtaskToggle = useCallback(async (taskId: string, subtaskIndex: number, isCompleted: boolean) => {
    if (!acquireLock()) return;
    
    try {
      console.log(`Toggling subtask ${subtaskIndex} of task ${taskId} to ${isCompleted}`);
      
      const subtask = localTasks.find(t => t.id === taskId)?.subtasks?.[subtaskIndex];
      
      if (subtask && subtask.id) {
        // Optimistic UI update
        setLocalTasks(prev => 
          prev.map(task => {
            if (task.id === taskId && task.subtasks) {
              const updatedSubtasks = [...task.subtasks];
              if (updatedSubtasks[subtaskIndex]) {
                updatedSubtasks[subtaskIndex] = {
                  ...updatedSubtasks[subtaskIndex],
                  is_completed: isCompleted
                };
              }
              return {
                ...task,
                subtasks: updatedSubtasks
              };
            }
            return task;
          })
        );
        
        const { error } = await supabase
          .from('todo_items')
          .update({ is_completed: isCompleted })
          .eq('id', subtask.id);
          
        if (error) throw error;
        
        toast({
          title: "Subtask updated",
          description: `Subtask ${isCompleted ? 'completed' : 'uncompleted'}`,
          variant: "success",
        });
        
        // Refresh in the background without freezing the UI
        await debouncedRefetch();
      }
    } catch (error) {
      console.error("Error toggling subtask:", error);
      
      // Revert the optimistic update on error
      await debouncedRefetch();
      
      toast({
        title: "Failed to update subtask",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      releaseLock();
    }
  }, [localTasks, debouncedRefetch, acquireLock, releaseLock]);
  
  // Handle restoring a task from archive with optimistic UI update
  const handleRestoreTask = useCallback(async (taskId: string) => {
    if (!onRestore || !acquireLock()) return;
    
    try {
      console.log(`Restoring task ${taskId} from archive`);
      
      // Optimistic UI update - remove from local display immediately
      setLocalTasks(prev => prev.filter(task => task.id !== taskId));
      
      await onRestore(taskId);
      
      toast({
        title: "Task restored",
        description: "Task has been restored from archive",
        variant: "success",
      });
      
      // Refresh in the background without freezing the UI
      await debouncedRefetch();
      
    } catch (error) {
      console.error("Error restoring task:", error);
      
      // Revert optimistic update on error
      await debouncedRefetch();
      
      toast({
        title: "Restore failed",
        description: error instanceof Error ? error.message : "Failed to restore task",
        variant: "destructive",
      });
    } finally {
      releaseLock();
    }
  }, [onRestore, debouncedRefetch, acquireLock, releaseLock]);
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {localTasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description || ""}
            dueDate={task.due_date ? new Date(task.due_date) : undefined}
            dueTime={task.due_time}
            status={task.status}
            priority={task.priority}
            userRole={userRole}
            isArchived={isArchiveView}
            subtasks={task.subtasks || []}
            completedDate={task.completed_at ? new Date(task.completed_at) : null}
            isRecurring={task.is_recurring}
            isRecurringInstance={task.is_recurring_instance}
            snoozeCount={task.snooze_count}
            snoozedUntil={task.snoozed_until ? new Date(task.snoozed_until) : null}
            refetch={debouncedRefetch}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onCancel={handleCancelTask}
            onStatusChange={handleStatusChange}
            onSnooze={handleSnoozeTask}
            onRestore={handleRestoreTask}
            onSubtaskToggle={handleSubtaskToggle}
          />
        ))}
      </div>
      
      {/* Delete/Cancel Confirmation Dialog */}
      <ConfirmationDialog
        title={isArchiveView ? "Permanently Delete Task" : (deleteReason === "deleted" ? "Delete Task" : "Cancel Task")}
        description={isArchiveView 
          ? "Are you sure you want to permanently delete this task? This action cannot be undone."
          : (deleteReason === "deleted" 
              ? "Are you sure you want to delete this task? It will be moved to the archive."
              : "Are you sure you want to cancel this task? It will be moved to the archive."
            )
        }
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDeleteTask}
        isLoading={isDeleting}
      />
    </>
  );
};

export default TaskGrid;
