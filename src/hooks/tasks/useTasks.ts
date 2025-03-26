
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
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setTasks([]);
        setIsLoading(false);
        return;
      }
      
      let query = supabase
        .from('tasks')
        .select('*, subtasks:todo_items(*)');
      
      if (activeTab === 'my-tasks') {
        query = query.eq('user_id', session.user.id);
      } else if (activeTab === 'assigned-tasks') {
        query = query.eq('assignee_id', session.user.id);
      } else if (activeTab === 'shared-tasks') {
        // Fetch tasks shared with the user
        const { data: sharedTaskIds, error: sharedError } = await supabase
          .from('shared_tasks')
          .select('task_id')
          .eq('shared_with', session.user.id);
          
        if (sharedError) throw sharedError;
        
        if (sharedTaskIds && sharedTaskIds.length > 0) {
          const taskIds = sharedTaskIds.map(st => st.task_id);
          query = query.in('id', taskIds);
        } else {
          // If no shared tasks, return empty array
          setTasks([]);
          setIsLoading(false);
          return;
        }
      } else if (activeTab === 'team-tasks') {
        // For staff, get team tasks from their business
        if (isStaff) {
          const businessId = localStorage.getItem('staffBusinessId');
          
          if (businessId) {
            query = query
              .eq('user_id', businessId)
              .eq('is_team_task', true);
              
            console.log(`Found ${businessId} as business ID for staff member`);
          } else {
            // No business ID found for staff
            setTasks([]);
            setIsLoading(false);
            return;
          }
        } else {
          // For business users, get their team tasks
          query = query
            .eq('user_id', session.user.id)
            .eq('is_team_task', true);
        }
      }
      
      const { data, error: fetchError } = await query
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      // Map any todo_items to subtasks
      const mappedTasks = (data || []).map((task: any) => {
        const subtasks = task.subtasks || [];
        return {
          ...task,
          subtasks
        };
      });
      
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
      setIsLoading(false);
    }
  }, [activeTab, isStaff]);

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
