
// Re-export domain types
export type { 
  Task, 
  SubTask, 
  TaskFormData, 
  TaskStatus, 
  TaskPriority, 
  TaskWithSharedInfo,
  TaskTab
} from './domain/types';

// Re-export application hooks
export { useTaskOperations } from './application/hooks/useTaskOperations';
export { useTaskQueries } from './application/hooks/useTaskQueries';
export { useTaskFilters } from './application/hooks/useTaskFilters';

// Re-export domain services
export { taskService } from './domain/services/taskService';
