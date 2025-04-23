
import React, { useState } from "react";
import { Task } from "@/types/task.types";
import TaskCard from "../ui/task-card/TaskCard";
import { useTaskOperations } from "@/hooks/tasks/useTaskOperations";
import { toast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface TaskListProps {
  tasks: Task[];
  onRefresh: () => Promise<void>;
}

export function TaskList({ tasks, onRefresh }: TaskListProps) {
  const { completeTask, deleteTask, isProcessing } = useTaskOperations("individual");
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const handleEdit = (task: Task) => {
    // For now, just display a toast - edit functionality will be added later
    toast({
      title: "Edit task",
      description: `Editing task: ${task.title}`,
      duration: 3000,
    });
  };

  const handleDeleteConfirm = async (taskId: string) => {
    try {
      setPendingTaskId(taskId);
      await deleteTask(taskId);
      toast({
        title: "Task deleted",
        description: "Task has been successfully deleted",
        variant: "default",
      });
      onRefresh();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    } finally {
      setPendingTaskId(null);
      setTaskToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteRequest = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const handleComplete = async (taskId: string) => {
    try {
      setPendingTaskId(taskId);
      await completeTask(taskId);
      toast({
        title: "Task completed",
        description: "Task has been marked as completed",
        variant: "default",
      });
      onRefresh();
    } catch (error) {
      console.error("Error completing task:", error);
      toast({
        title: "Error",
        description: "Failed to complete task",
        variant: "destructive",
      });
    } finally {
      setPendingTaskId(null);
    }
  };
  
  const handleStatusChange = async (taskId: string, status: string) => {
    if (status === "completed") {
      await handleComplete(taskId);
    }
  };

  const handleSubtaskToggle = async (taskId: string, subtaskIndex: number, isCompleted: boolean) => {
    // This will be implemented when we connect to the subtask API
    toast({
      title: "Subtask toggled",
      description: `Subtask ${subtaskIndex + 1} ${isCompleted ? "completed" : "uncompleted"}`,
      duration: 2000,
    });
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No tasks found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description || ""}
            dueDate={task.due_date ? new Date(task.due_date) : new Date()}
            dueTime={task.due_time}
            status={task.status}
            priority={task.priority}
            userRole="individual"
            subtasks={task.subtasks || []}
            isArchived={!!task.archived_at}
            completedDate={task.completed_at ? new Date(task.completed_at) : undefined}
            isRecurring={task.is_recurring}
            isRecurringInstance={task.is_recurring_instance}
            snoozeCount={task.snooze_count}
            snoozedUntil={task.snoozed_until ? new Date(task.snoozed_until) : undefined}
            refetch={onRefresh}
            onEdit={(id) => handleEdit(tasks.find(t => t.id === id)!)}
            onDelete={handleDeleteRequest}
            onStatusChange={handleStatusChange}
            onSubtaskToggle={handleSubtaskToggle}
          />
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => taskToDelete && handleDeleteConfirm(taskToDelete)}
              disabled={isProcessing}
              className="bg-red-500 hover:bg-red-600"
            >
              {isProcessing ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
