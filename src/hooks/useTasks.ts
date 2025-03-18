
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority } from "@/types/task.types";
import { fetchTasks } from "@/services/task/fetchService";

export type TaskTab = "my-tasks" | "shared-tasks" | "assigned-tasks";

export const useTasks = (initialTab: TaskTab = "my-tasks") => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "all">("all");
  const [activeTab, setActiveTab] = useState<TaskTab>(initialTab);

  // Query tasks based on the selected tab
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["tasks", activeTab],
    queryFn: async () => {
      console.log("Fetching tasks for tab:", activeTab);

      // Check user session
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("Auth session exists:", !!sessionData.session, "User ID:", sessionData.session?.user?.id);
      
      if (!sessionData?.session?.user) {
        console.error("Not authenticated when fetching tasks");
        return { tasks: [], userRole: "free" as const };
      }

      return fetchTasks(activeTab);
    }
  });

  // Create a task
  const createTask = async (taskData: any) => {
    try {
      console.log("Creating task:", taskData);

      // Check user session
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("Auth session exists:", !!sessionData.session, "User ID:", sessionData.session?.user?.id);
      
      if (!sessionData?.session?.user) {
        console.error("Not authenticated when creating task");
        throw new Error("You must be logged in to create a task");
      }

      const { data: task, error } = await supabase
        .from("tasks")
        .insert({
          ...taskData,
          user_id: sessionData.session.user.id
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating task:", error);
        throw error;
      }

      console.log("Task created successfully:", task);
      toast({
        title: "Task created",
        description: "Your task has been created successfully",
      });

      refetch();
      return task;
    } catch (error: any) {
      console.error("Error in createTask:", error);
      toast({
        title: "Failed to create task",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Filter tasks based on search query and filters
  const filteredTasks = (data?.tasks || []).filter((task) => {
    // Filter by search query
    const matchesSearch =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter by status
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;

    // Filter by priority
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  console.log("Filtered tasks count:", filteredTasks.length);

  return {
    tasks: data?.tasks || [],
    filteredTasks,
    isLoading,
    error,
    refetch,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    activeTab,
    setActiveTab: (tab: TaskTab) => {
      console.log("Setting active tab to:", tab);
      setActiveTab(tab);
    },
    createTask,
    userRole: data?.userRole || "free"
  };
};
