
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority } from "@/types/task.types";
import TaskControls from "@/components/tasks/TaskControls";
import TasksLoading from "@/components/tasks/TasksLoading";
import TasksHeader from "@/components/tasks/TasksHeader";
import TasksContainer from "@/components/tasks/TasksContainer";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { TaskStatusFilter, TaskPriorityFilter } from "@/components/tasks/types";
import { toast } from "@/components/ui/use-toast";

const DashboardTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatusFilter>("all");
  const [filterPriority, setFilterPriority] = useState<TaskPriorityFilter>("all");
  const [userRole, setUserRole] = useState<"free" | "individual" | "business" | "staff" | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);

  // Determine user role
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole("free");
        return;
      }
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', user.id)
          .single();
          
        setUserRole(data?.account_type || "free");
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("free");
      } finally {
        setInitialCheckDone(true);
      }
    };
    
    fetchUserRole();
  }, [user]);

  // Fetch tasks
  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, subtasks:todo_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Failed to load tasks",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, forceRefresh]);

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchQuery ? 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) : 
      true;
      
    const matchesStatus = filterStatus === "all" ? true : task.status === filterStatus;
    const matchesPriority = filterPriority === "all" ? true : task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const isPaidAccount = userRole === "individual" || userRole === "business";
  
  // Handle creating a new task
  const handleCreateTask = async (taskData: any) => {
    try {
      // Check if free user has reached their task limit
      if (userRole === "free") {
        const { count, error } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user?.id);
          
        if (error) throw error;
        
        if (count && count >= 1) {
          toast({
            title: "Task limit reached",
            description: "Free accounts are limited to 1 task. Please upgrade to create more tasks.",
            variant: "destructive"
          });
          return;
        }
      }
      
      // Create the task
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          user_id: user?.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Create subtasks if any
      if (taskData.subtasks && taskData.subtasks.length > 0) {
        const subtasksToInsert = taskData.subtasks.map((subtask: any) => ({
          task_id: data.id,
          content: subtask.content,
          is_completed: false
        }));
        
        const { error: subtaskError } = await supabase
          .from('todo_items')
          .insert(subtasksToInsert);
          
        if (subtaskError) throw subtaskError;
      }
      
      toast({
        title: "Task created",
        description: "Your task has been created successfully",
        variant: "success"
      });
      
      setCreateDialogOpen(false);
      setForceRefresh(prev => prev + 1); // Trigger refresh
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Failed to create task",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  if (isLoading || !initialCheckDone) {
    return <TasksLoading />;
  }

  return (
    <div className="space-y-6">
      <TasksHeader />
      
      <TaskControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        filterPriority={filterPriority}
        onPriorityChange={setFilterPriority}
        onCreateTask={() => setCreateDialogOpen(true)}
        isPaidAccount={isPaidAccount}
        userRole={userRole || "free"}
      />
      
      <TasksContainer
        tasks={filteredTasks}
        userRole={userRole}
        refetch={fetchTasks}
        isPaidAccount={isPaidAccount}
        onCreateTask={() => setCreateDialogOpen(true)}
        key={`task-container-${forceRefresh}`} // Add a key to force re-render
      />
      
      <CreateTaskDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateTask={handleCreateTask}
        userRole={userRole || "free"}
      />
    </div>
  );
};

export default DashboardTasks;
