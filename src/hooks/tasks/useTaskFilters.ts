
import { useState, useMemo } from 'react';
import { TaskWithSharedInfo, UseTaskFiltersReturn } from './types';

export const useTaskFilters = (tasks: TaskWithSharedInfo[] = []): UseTaskFiltersReturn => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const searchLower = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
      );
    });
  }, [tasks, searchQuery, filterStatus, filterPriority]);

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filteredTasks,
  };
};
