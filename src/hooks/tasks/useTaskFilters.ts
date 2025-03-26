
import { useState, useMemo } from 'react';
import { TaskWithSharedInfo, UseTaskFiltersReturn } from './types';

export const useTaskFilters = (tasks: TaskWithSharedInfo[]): UseTaskFiltersReturn => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  // Apply all filters to the tasks
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    
    return tasks.filter(task => {
      // Apply search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower));
      
      // Apply status filter
      const matchesStatus = 
        filterStatus === "all" || 
        task.status === filterStatus;
      
      // Apply priority filter
      const matchesPriority = 
        filterPriority === "all" || 
        task.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, filterStatus, filterPriority]);

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filteredTasks
  };
};
