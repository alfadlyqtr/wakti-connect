
import React, { useState } from "react";
import { Task } from "@/types/task.types";
import { TaskCard } from "./TaskCard";
import { useTaskOperations } from "@/hooks/tasks/useTaskOperations";
import { toast } from "@/components/ui/use-toast";

interface TaskListProps {
  tasks: Task[];
  onRefresh: () => Promise<void>;
}

export function TaskList({ tasks, onRefresh }: TaskListProps) {
  const { completeTask, deleteTask, isProcessing } = useTaskOperations("individual");
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);

  const handleEdit = (task: Task) => {
    // For now, just display a toast - edit functionality will be added later
    toast({
      title: "Edit task",
      description: `Editing task: ${task.title}`,
      duration: 3000,
    });
  };

  const handleDelete = async (taskId: string) => {
    try {
      setPendingTaskId(taskId);
      await deleteTask(taskId);
      toast({
        title: "Task deleted",
        description: "Task has been successfully deleted",
        variant: "success",
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
    }
  };

  const handleComplete = async (taskId: string) => {
    try {
      setPendingTaskId(taskId);
      await completeTask(taskId);
      toast({
        title: "Task completed",
        description: "Task has been marked as completed",
        variant: "success",
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

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No tasks found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onComplete={handleComplete}
        />
      ))}
    </div>
  );
}
