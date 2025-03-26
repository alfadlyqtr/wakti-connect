
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskTab } from '@/types/task.types';
import { useTaskOperations } from './useTaskOperations';
import { UseTasksReturn } from './types';
import { toast } from "@/components/ui/use-toast";

export const useTasks = (activeTab: TaskTab): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"free" | "individual" | "business" | "staff" | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // Check if user is staff
  useEffect(() => {
    const checkStaffStatus = async () => {
      const isStaffMember = localStorage.getItem('isStaff') === 'true';
      setIsStaff(isStaffMember);
      
      if (isStaffMember) {
        setUserRole('staff');
      } else {
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
      }
    };
    
    checkStaffStatus();
  }, []);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    const now = Date.now();
    setLastFetchTime(now);
    
    try {
      console.log(`Fetching tasks for tab: ${activeTab}, timestamp: ${now}`);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No active session, returning empty tasks array");
        setTasks([]);
        setIsLoading(false);
        return;
      }
      
      // Store userId in localStorage for later use (task claiming etc.)
      localStorage.setItem('userId', session.user.id);
      
      let query = supabase
        .from('tasks')
        .select('*, subtasks:todo_items(*)');
      
      if (activeTab === 'my-tasks') {
        console.log(`Fetching my tasks for user ${session.user.id}`);
        query = query.eq('user_id', session.user.id);
      } else if (activeTab === 'assigned-tasks') {
        console.log(`Fetching assigned tasks for user ${session.user.id}`);
        query = query.eq('assignee_id', session.user.id);
      } else if (activeTab === 'shared-tasks') {
        // Fetch tasks shared with the user
        console.log(`Fetching shared tasks for user ${session.user.id}`);
        const { data: sharedTaskIds, error: sharedError } = await supabase
          .from('shared_tasks')
          .select('task_id')
          .eq('shared_with', session.user.id);
          
        if (sharedError) {
          console.error("Error fetching shared task IDs:", sharedError);
          throw sharedError;
        }
        
        if (sharedTaskIds && sharedTaskIds.length > 0) {
          const taskIds = sharedTaskIds.map(st => st.task_id);
          console.log(`Found ${taskIds.length} shared tasks`, taskIds);
          query = query.in('id', taskIds);
        } else {
          // If no shared tasks, return empty array
          console.log("No shared tasks found");
          setTasks([]);
          setIsLoading(false);
          return;
        }
      } else if (activeTab === 'team-tasks') {
        // For staff, get team tasks from their business
        if (isStaff) {
          const businessId = localStorage.getItem('staffBusinessId');
          
          if (businessId) {
            console.log(`Fetching team tasks for staff in business ${businessId}`);
            query = query
              .eq('user_id', businessId)
              .eq('is_team_task', true);
          } else {
            // No business ID found for staff
            console.log("No business ID found for staff member");
            setTasks([]);
            setIsLoading(false);
            return;
          }
        } else {
          // For business users, get their team tasks
          console.log(`Fetching team tasks for business ${session.user.id}`);
          query = query
            .eq('user_id', session.user.id)
            .eq('is_team_task', true);
        }
      }
      
      const { data, error: fetchError } = await query
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
      
      console.log(`Successfully fetched ${mappedTasks.length} tasks for tab ${activeTab}`);
      
      if (activeTab === 'team-tasks' && isStaff) {
        console.log(`Found ${mappedTasks.length} team tasks for business ${localStorage.getItem('staffBusinessId')}`);
      }
      
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
  }, [activeTab, isStaff, lastFetchTime]);

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

  const { createTask } = useTaskOperations(userRole, isStaff);

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
    isStaff,
    refetch: fetchTasks
  };
};
