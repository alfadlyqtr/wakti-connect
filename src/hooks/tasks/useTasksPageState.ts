
import { useState, useEffect, useCallback } from "react";
import { useTaskQueries } from "./useTaskQueries";
import { useAuth } from "@/features/auth";
import { Task, TaskFormData, TaskTab } from "@/types/task.types";
import { toast } from "@/components/ui/use-toast";

export const useTasksPageState = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [currentEditTask, setCurrentEditTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<TaskTab>("my-tasks");
  
  const { effectiveRole } = useAuth();
  
  // Determine if user has a paid account (business or superadmin)
  const isPaidAccount = effectiveRole === 'business' || effectiveRole === 'superadmin';
  
  const {
    tasks,
    sharedTasks,
    isLoading,
    isError,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: refetchTasks
  } = useTaskQueries();
  
  // Filter tasks based on search query, status, priority, and active tab
  const filteredTasks = useCallback(() => {
    let taskList = tasks || [];
    
    // Determine which tasks to show based on active tab
    if (activeTab === "shared-with-me") {
      taskList = sharedTasks || [];
    }
    
    return taskList.filter(task => {
      // Filter by search query
      const matchesSearch = 
        !searchQuery || 
        task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = 
        filterStatus === "all" || 
        task.status === filterStatus;
      
      // Filter by priority
      const matchesPriority = 
        filterPriority === "all" || 
        task.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, sharedTasks, searchQuery, filterStatus, filterPriority, activeTab]);
  
  // Handler for creating a task
  const handleCreateTask = async (taskData: TaskFormData): Promise<Task> => {
    try {
      const newTask = await createTask(taskData);
      await refetchTasks();
      
      toast({
        title: "Task created",
        description: "Your task has been created successfully."
      });
      
      return newTask;
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Failed to create task",
        description: "There was an error creating your task. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  // Handler for updating a task
  const handleUpdateTask = async (taskId: string, taskData: Partial<Task>): Promise<void> => {
    try {
      await updateTask(taskId, taskData);
      await refetchTasks();
      
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully."
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Failed to update task",
        description: "There was an error updating your task. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    userRole: effectiveRole,
    createTaskDialogOpen,
    setCreateTaskDialogOpen,
    editTaskDialogOpen,
    setEditTaskDialogOpen,
    currentEditTask,
    setCurrentEditTask,
    handleCreateTask,
    handleUpdateTask,
    refetchTasks,
    filteredTasks: filteredTasks(),
    isLoading,
    isError,
    error,
    deleteTask,
    isPaidAccount,
    activeTab,
    setActiveTab
  };
};
