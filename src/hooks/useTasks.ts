
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "in-progress" | "completed" | "late";
  priority: "urgent" | "high" | "medium" | "normal";
  due_date: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useTasks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  // Fetch tasks with React Query
  const { data: tasks, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('due_date', { ascending: true });
      
      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
      
      return data as Task[];
    },
    refetchOnWindowFocus: false,
  });

  // Create a new task
  const createTask = async () => {
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create tasks",
          variant: "destructive",
        });
        return;
      }

      // Create a sample task
      const newTask = {
        user_id: session.user.id,
        title: "New Task",
        description: "Click to edit this task",
        status: "pending",
        priority: "normal",
        due_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Task Created",
        description: "New task has been created successfully",
      });

      // Refetch tasks to update the list
      refetch();
    } catch (error: any) {
      toast({
        title: "Failed to create task",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Filter tasks based on search and filters
  const getFilteredTasks = () => {
    return tasks?.filter((task) => {
      // Search filter
      const matchesSearch = searchQuery 
        ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      // Status filter
      const matchesStatus = filterStatus === "all" ? true : task.status === filterStatus;
      
      // Priority filter
      const matchesPriority = filterPriority === "all" ? true : task.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    }) || [];
  };

  return {
    tasks,
    filteredTasks: getFilteredTasks(),
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    createTask,
    refetch
  };
};
