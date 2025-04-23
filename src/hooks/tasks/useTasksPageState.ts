import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useTaskQueries } from './useTaskQueries';
import { TaskTab } from '@/types/task.types';
import { TaskStatusFilter, TaskPriorityFilter } from '@/components/tasks/types';
import { UserRole } from '@/types/user';

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
  
  const {
    tasks,
    isLoading,
    error,
    refetch: refetchTasks,
    userRole: detectedUserRole,
    isStaff
  } = useTaskQueries(activeTab as any);
  
  useEffect(() => {
    const getUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setUserRole('individual');
          return;
        }
        
        if (localStorage.getItem('isSuperAdmin') === 'true') {
          setUserRole('super-admin');
          return;
        }
        
        const isStaffMember = localStorage.getItem('isStaff') === 'true';
        
        if (isStaffMember) {
          setUserRole('staff');
          return;
        }
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', session.user.id)
          .single();
        
        if (profileData?.account_type === 'business') {
          setUserRole('business');
        } else if (profileData?.account_type === 'staff') {
          setUserRole('staff');
        } else if (profileData?.account_type === 'super-admin') {
          setUserRole('super-admin');
        } else {
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
  
  const handleCreateTask = async (taskData: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('You must be logged in to create tasks');
      
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
      
      toast({
        title: 'Task created',
        description: 'Your task was created successfully',
      });
      
      refetchTasks();
      
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
  
  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) throw new Error(error.message);
      
      toast({
        title: 'Task deleted',
        description: 'Your task was deleted successfully',
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting task:', err);
      toast({
        variant: 'destructive',
        title: 'Failed to delete task',
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
      return false;
    }
  };
  
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
    deleteTask,
    refetchTasks,
    filteredTasks,
    isPaidAccount,
    activeTab,
    setActiveTab,
    isStaff
  };
};
