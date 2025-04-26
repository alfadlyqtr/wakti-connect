
import { useState, useEffect } from 'react';
import { TaskWithSharedInfo } from '../../domain/types';

export const useTaskFilters = (tasks: TaskWithSharedInfo[]) => {
  const [filteredTasks, setFilteredTasks] = useState<TaskWithSharedInfo[]>(tasks);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);

  // Apply filters when tasks or filter criteria change
  useEffect(() => {
    const filtered = tasks.filter(task => {
      // Search filter
      const matchesSearch = searchQuery 
        ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      // Status filter
      const matchesStatus = filterStatus ? task.status === filterStatus : true;
      
      // Priority filter
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
