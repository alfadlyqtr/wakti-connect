
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskStatus, TaskPriority } from '@/types/task.types';

interface UseTasksReturn {
  tasks: Task[];
  filteredTasks: Task[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  priorityFilter: string | null;
  setPriorityFilter: (priority: string | null) => void;
  refetch: () => Promise<void>;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setTasks([]);
        setFilteredTasks([]);
        return;
      }
      
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*, subtasks:todo_items(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      const typedTasks = (data || []).map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        due_date: task.due_date,
        due_time: task.due_time,
        user_id: task.user_id,
        created_at: task.created_at,
        updated_at: task.updated_at,
        completed_at: task.completed_at,
        subtasks: task.subtasks || [],
        archived_at: task.archived_at,
        archive_reason: task.archive_reason
      }));
      
      setTasks(typedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
    } finally {
      setIsLoading(false);
    }
  };

  // Filter tasks based on current filters
  useEffect(() => {
    const filtered = tasks.filter(task => {
      // Search filter
      const matchesSearch = searchQuery 
        ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      // Status filter
      const matchesStatus = statusFilter ? task.status === statusFilter : true;
      
      // Priority filter
      const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
    
    setFilteredTasks(filtered);
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
    
    // Set up a subscription to task changes
    const channel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks' 
      }, () => {
        fetchTasks();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    tasks,
    filteredTasks,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    refetch: fetchTasks
  };
}
