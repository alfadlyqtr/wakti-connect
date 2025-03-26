
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/task.types';
import { useTaskOperations } from './useTaskOperations';
import { UseTasksReturn } from './types';
import { toast } from "@/components/ui/use-toast";

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"free" | "individual" | "business" | "staff" | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // Check user role
  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          setUserRole(profile.account_type as any);
        } else {
          setUserRole('free');
        }
      }
    };
    
    checkUserRole();
  }, []);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    const now = Date.now();
    setLastFetchTime(now);
    
    try {
      console.log(`Fetching tasks, timestamp: ${now}`);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No active session, returning empty tasks array");
        setTasks([]);
        setIsLoading(false);
        return;
      }
      
      // Store userId in localStorage for later use
      localStorage.setItem('userId', session.user.id);
      
      // Only fetch user's own tasks since we removed sharing and assignment
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*, subtasks:todo_items(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (fetchError) {
        console.error("Error fetching tasks:", fetchError);
        throw fetchError;
      }
      
      // Map any todo_items to subtasks
      const mappedTasks = (data || []).map((task: any) => {
        const subtasks = task.subtasks || [];
        return {
          ...task,
          subtasks
        };
      });
      
      console.log(`Successfully fetched ${mappedTasks.length} tasks`);
      
      setTasks(mappedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
      toast({
        title: "Failed to load tasks",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      if (now === lastFetchTime) { // Only update if this is still the latest fetch
        setIsLoading(false);
      }
    }
  }, [lastFetchTime]);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchQuery ? 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) : 
      true;
      
    const matchesStatus = filterStatus ? task.status === filterStatus : true;
    const matchesPriority = filterPriority ? task.priority === filterPriority : true;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Ensure we're passing both required arguments to useTaskOperations
  const { createTask } = useTaskOperations(userRole, false);

  return {
    tasks,
    filteredTasks,
    isLoading,
    error,
    searchQuery, 
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    createTask,
    userRole,
    isStaff: false, // We removed staff functionality
    refetch: fetchTasks
  };
};
