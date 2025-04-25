
import { useState, useEffect } from "react";
import { fetchUserTasks, searchTasks, createTask } from "@/services/tasks/taskService";
import { Task, TaskFormData } from "@/types/task.types";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUserTasks();
        setTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleCreateTask = async (taskData: TaskFormData): Promise<Task | null> => {
    try {
      const newTask = await createTask(taskData);
      if (newTask) {
        setTasks(prev => [newTask, ...prev]);
      }
      return newTask;
    } catch (error) {
      console.error('Error in handleCreateTask:', error);
      return null;
    }
  };

  return { tasks, isLoading, error, handleCreateTask };
};
