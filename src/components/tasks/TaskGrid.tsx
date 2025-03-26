
import React, { useState } from "react";
import { Task, TaskTab, SubTask } from "@/types/task.types";
import TaskCard from "@/components/ui/TaskCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { shareTask, assignTask } from "@/services/task/sharingService";

interface TaskGridProps {
  tasks: Task[];
  userRole: "free" | "individual" | "business" | "staff" | null;
  tab: TaskTab;
  refetch: () => void;
}

const TaskGrid: React.FC<TaskGridProps> = ({ tasks, userRole, tab, refetch }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Determine if tasks are editable
  const isEditable = (task: Task) => {
    // Business users can edit all tasks they created, including team tasks
    if (userRole === "business") {
      return true;
    }
    
    // Staff can edit tasks assigned to them or that they claimed
    if (userRole === "staff") {
      return task.assignee_id === localStorage.getItem('userId') || 
             tab === "assigned-tasks";
    }
    
    // For regular users, they can't edit team tasks
    return !task.is_team_task;
  };

  // Handler for editing a task
  const handleEditTask = (taskId: string) => {
    // In a real implementation, this would open a modal or navigate to edit page
    console.log("Editing task:", taskId);
    
    // For now, just show a toast that this functionality is not yet implemented
    toast({
      title: "Edit Task",
      description: `Opening edit modal for task ${taskId}`,
    });
  };

  // Handler for deleting a task
  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteDialog(true);
  };

  // Confirming task deletion
  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskToDelete);
        
      if (error) throw error;
      
      toast({
        title: "Task deleted",
        description: "The task has been successfully deleted",
        variant: "success",
      });
      
      // Close dialog and refresh tasks
      setShowDeleteDialog(false);
      refetch();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete task",
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
      
      toast({
        title: "Status updated",
        description: `Task marked as ${newStatus}`,
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

  // Handler for sharing a task with another user
  const handleShareTask = async (taskId: string) => {
    try {
      // In a real implementation, this would open a dialog to select a user
      toast({
        title: "Share Task",
        description: "Opening share dialog (not implemented yet)",
      });
      
      // For demonstration, we're just showing this would use shareTask service
      // await shareTask(taskId, selectedUserId);
    } catch (error) {
      console.error("Error sharing task:", error);
      toast({
        title: "Share failed",
        description: error instanceof Error ? error.message : "Failed to share task",
        variant: "destructive",
      });
    }
  };

  // Handler for assigning a task to a staff member
  const handleAssignTask = async (taskId: string) => {
    try {
      // In a real implementation, this would open a dialog to select a staff member
      toast({
        title: "Assign Task",
        description: "Opening staff selection dialog (not implemented yet)",
      });
      
      // For demonstration, we're just showing this would use assignTask service
      // await assignTask(taskId, selectedStaffId);
    } catch (error) {
      console.error("Error assigning task:", error);
      toast({
        title: "Assignment failed",
        description: error instanceof Error ? error.message : "Failed to assign task",
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
      console.log(`Toggling subtask ${subtaskIndex} for task ${taskId} to ${isCompleted}`);
      
      // In a real implementation, this would update the subtask in the database
      // For now, just show a toast
      toast({
        title: "Subtask toggled",
        description: `Subtask ${subtaskIndex + 1} ${isCompleted ? 'completed' : 'uncompleted'}`,
      });
      
      // Here we would perform the actual update to the subtask
      // This would typically involve an update to the subtasks in the task or a separate subtasks table
    } catch (error) {
      console.error("Error toggling subtask:", error);
      toast({
        title: "Failed to toggle subtask",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
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
            isAssigned={!!task.assignee_id}
            isShared={!!task.delegated_to}
            subtasks={task.subtasks || []}
            completedDate={task.completed_at ? new Date(task.completed_at) : null}
            isRecurring={task.is_recurring}
            isRecurringInstance={task.is_recurring_instance}
            snoozeCount={task.snooze_count}
            snoozedUntil={task.snoozed_until ? new Date(task.snoozed_until) : null}
            delegatedEmail={task.delegated_email}
            assigneeId={task.assignee_id}
            refetch={refetch}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
            onShare={handleShareTask}
            onAssign={handleAssignTask}
            onSnooze={handleSnoozeTask}
            onSubtaskToggle={handleSubtaskToggle}
          />
        ))}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDeleteTask}
        isLoading={isDeleting}
      />
    </>
  );
};

export default TaskGrid;
