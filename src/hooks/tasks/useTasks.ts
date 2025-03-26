
import { useTaskQueries } from './useTaskQueries';
import { useTaskFilters } from './useTaskFilters';
import { useTaskOperations } from './useTaskOperations';
import { TaskWithSharedInfo, TaskTab } from './types';

export const useTasks = (tab: TaskTab = "my-tasks") => {
  // Get tasks and loading state
  const { 
    tasks,
    isLoading, 
    error,
    refetch,
    userRole,
    isStaff
  } = useTaskQueries(tab);
  
  // Get filter functionality
  const {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filteredTasks
  } = useTaskFilters(tasks);
  
  // Get task operations
  const { createTask, delegateTask } = useTaskOperations(userRole, isStaff);

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
    delegateTask,
    userRole,
    isStaff,
    refetch
  };
};
