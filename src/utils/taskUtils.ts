
import { Task } from "@/types/task.types";

export function filterTasks(
  tasks: Task[],
  searchQuery: string = "",
  filterStatus: string = "all",
  filterPriority: string = "all"
): Task[] {
  return tasks.filter((task) => {
    // Search filter
    const matchesSearch = searchQuery 
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    
    // Status filter
    const matchesStatus = filterStatus === "all" ? true : task.status === filterStatus;
    
    // Priority filter
    const matchesPriority = filterPriority === "all" ? true : task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
}
