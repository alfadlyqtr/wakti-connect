import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useTaskQueries } from '@/hooks/tasks/useTaskQueries';
import { TaskTab } from '@/types/task.types';
import { TaskStatusFilter, TaskPriorityFilter } from './types';
import { UserRole } from '@/types/user';

// Define the useTasksPageState hook types and implementation
export const useTasksPageState = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [currentEditTask, setCurrentEditTask] = useState(null);
  const [activeTab, setActiveTab] = useState<TaskTab>('my-tasks');
  const [userRole, setUserRole] = useState<UserRole>('individual');
  
  // Initialize task queries
  const {
    tasks,
    isLoading,
    error,
    refetch: refetchTasks,
    userRole: detectedUserRole,
    isStaff
  } = useTaskQueries(activeTab as any); // Cast to any to avoid type issues
  
  // Effect to get user role
  useEffect(() => {
    const getUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setUserRole('individual');
          return;
        }
        
        // Check local storage for super admin status (faster)
        if (localStorage.getItem('isSuperAdmin') === 'true') {
          setUserRole('super-admin');
          return;
        }
        
        // Check if user is staff
        const isStaffMember = localStorage.getItem('isStaff') === 'true';
        
        if (isStaffMember) {
          setUserRole('staff');
          return;
        }
        
        // Get account type from profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', session.user.id)
          .single();
        
        // Set user role based on account type
        if (profileData?.account_type === 'business') {
          setUserRole('business');
        } else if (profileData?.account_type === 'staff') {
          setUserRole('staff');
        } else if (profileData?.account_type === 'super-admin') {
          setUserRole('super-admin');
        } else {
          // Default to individual
          setUserRole('individual');
        }
      } catch (err) {
        console.error('Error getting user role:', err);
        setUserRole('individual');
      }
    };
    
    if (detectedUserRole) {
      setUserRole(detectedUserRole);
    } else {
      getUserRole();
    }
  }, [detectedUserRole]);
  
  // Filter tasks based on search, status, and priority
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchQuery 
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    
    const matchesStatus = filterStatus && filterStatus !== 'all' 
      ? task.status === filterStatus 
      : true;
    
    const matchesPriority = filterPriority && filterPriority !== 'all'
      ? task.priority === filterPriority
      : true;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  // Handle creating a new task
  const handleCreateTask = async (taskData: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('You must be logged in to create tasks');
      
      // Create task
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          user_id: session.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      
      // Success message
      toast({
        title: 'Task created',
        description: 'Your task was created successfully',
      });
      
      // Refetch tasks
      refetchTasks();
      
      // Reset form
      setCreateTaskDialogOpen(false);
      
      return data;
    } catch (err) {
      console.error('Error creating task:', err);
      toast({
        variant: 'destructive',
        title: 'Failed to create task',
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
      return null;
    }
  };
  
  // Handle updating a task
  const handleUpdateTask = async (taskId: string, taskData: any) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...taskData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      
      toast({
        title: 'Task updated',
        description: 'Your task was updated successfully',
      });
      
      refetchTasks();
      setEditTaskDialogOpen(false);
      
      return data;
    } catch (err) {
      console.error('Error updating task:', err);
      toast({
        variant: 'destructive',
        title: 'Failed to update task',
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
      return null;
    }
  };
  
  // Handle archiving a task
  const handleArchiveTask = async (taskId: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          is_archived: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      
      toast({
        title: 'Task archived',
        description: 'Your task was archived successfully',
      });
      
      refetchTasks();
      
      return data;
    } catch (err) {
      console.error('Error archiving task:', err);
      toast({
        variant: 'destructive',
        title: 'Failed to archive task',
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
      return null;
    }
  };
  
  // Handle restoring a task from archive
  const handleRestoreTask = async (taskId: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          is_archived: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      
      toast({
        title: 'Task restored',
        description: 'Your task was restored from the archive',
      });
      
      refetchTasks();
      
      return data;
    } catch (err) {
      console.error('Error restoring task:', err);
      toast({
        variant: 'destructive',
        title: 'Failed to restore task',
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
      return null;
    }
  };
  
  // Determine if account is paid (business or super-admin)
  const isPaidAccount = userRole === 'business' || userRole === 'super-admin';
  
  return {
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    userRole,
    createTaskDialogOpen,
    setCreateTaskDialogOpen,
    editTaskDialogOpen,
    setEditTaskDialogOpen,
    currentEditTask,
    setCurrentEditTask,
    handleCreateTask,
    handleUpdateTask,
    handleArchiveTask,
    handleRestoreTask,
    refetchTasks,
    filteredTasks,
    isPaidAccount,
    activeTab,
    setActiveTab,
    isStaff
  };
};
