# Task Hooks

This directory contains hooks related to task management functionality, refactored from the original `useTasks.ts` file for improved maintainability and separation of concerns.

## Structure

- `index.ts` - Exports all hooks and types
- `types.ts` - Contains shared types for task hooks
- `useTasks.ts` - Main hook that combines all task functionality
- `useTaskFilters.ts` - Hook for filtering tasks
- `useTaskQueries.ts` - Hook for fetching tasks from the API
- `useTaskOperations.ts` - Hook for task operations (create, update, delete)

## Usage

```tsx
import { useTasks } from '@/hooks/tasks';

const MyComponent = () => {
  const {
    filteredTasks,
    isLoading,
    error,
    // ...other properties and methods
  } = useTasks('my-tasks');

  // Use the hook data and methods
};
```
