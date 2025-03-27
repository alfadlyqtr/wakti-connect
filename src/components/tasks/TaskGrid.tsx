
import React, { useState } from "react";
import { Task, SubTask } from "@/types/task.types";
import TaskCard from "@/components/ui/TaskCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { TaskCardCompletionAnimation } from "@/components/ui/task-card/TaskCardCompletionAnimation";

interface TaskGridProps {
  tasks: Task[];
  userRole: "free" | "individual" | "business" | "staff" | null;
  refetch: () => void;
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
  
  // Handler for editing a task
  const handleEditTask = (taskId: string) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      onEdit(taskToEdit);
    }
  };

  // Handler for deleting/canceling a task
  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteReason("deleted");
    setShowDeleteDialog(true);
  };
  
  // Handler for canceling a task
  const handleCancelTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteReason("canceled");
    setShowDeleteDialog(true);
  };

  // Confirming task deletion/cancellation
  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      setIsDeleting(true);
      
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
      
      // Close dialog and refresh tasks
      setShowDeleteDialog(false);
      refetch();
    } catch (error) {
      console.error("Error deleting/archiving task:", error);
      toast({
        title: "Operation failed",
        description: error instanceof Error ? error.message : "Failed to process task",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setTaskToDelete(null);
    }
  };

  // Handler for changing task status
  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
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
      };
      
      toast({
        title: "Status updated",
        description: statusMessages[newStatus as keyof typeof statusMessages] || `Task marked as ${newStatus}`,
        variant: "success",
      });
      
      // Refresh tasks
      refetch();
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({
        title: "Status update failed",
        description: error instanceof Error ? error.message : "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  // Handler for snoozing a task
  const handleSnoozeTask = async (taskId: string, days: number) => {
    try {
      // Calculate the snooze date
      const snoozedUntil = new Date();
      snoozedUntil.setDate(snoozedUntil.getDate() + days);
      
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('snooze_count')
        .eq('id', taskId)
        .single();
        
      if (fetchError) throw fetchError;
      
      const currentSnoozeCount = data.snooze_count || 0;
      
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
      
      // Refresh tasks
      refetch();
    } catch (error) {
      console.error("Error snoozing task:", error);
      toast({
        title: "Snooze failed",
        description: error instanceof Error ? error.message : "Failed to snooze task",
        variant: "destructive",
      });
    }
  };

  // Handler for toggling a subtask
  const handleSubtaskToggle = async (taskId: string, subtaskIndex: number, isCompleted: boolean) => {
    try {
      const subtask = tasks.find(t => t.id === taskId)?.subtasks?.[subtaskIndex];
      
      if (subtask && subtask.id) {
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
        
        // Refresh tasks
        refetch();
      }
    } catch (error) {
      console.error("Error toggling subtask:", error);
      toast({
        title: "Failed to update subtask",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Handle restoring a task from archive
  const handleRestoreTask = async (taskId: string) => {
    if (onRestore) {
      await onRestore(taskId);
    }
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description || ""}
            dueDate={new Date(task.due_date || "")}
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
            refetch={refetch}
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
