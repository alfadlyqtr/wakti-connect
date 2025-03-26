
import { useState, useEffect } from 'react';
import { TaskWithSharedInfo, UseTaskFiltersReturn } from './types';

export const useTaskFilters = (tasks: TaskWithSharedInfo[]): UseTaskFiltersReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<TaskWithSharedInfo[]>(tasks);

  useEffect(() => {
    const filtered = tasks.filter(task => {
      const matchesSearch = searchQuery ? 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) : 
        true;
        
      const matchesStatus = filterStatus ? task.status === filterStatus : true;
      const matchesPriority = filterPriority ? task.priority === filterPriority : true;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
    
    setFilteredTasks(filtered);
  }, [tasks, searchQuery, filterStatus, filterPriority]);

  return {
    filteredTasks,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority
  };
};
