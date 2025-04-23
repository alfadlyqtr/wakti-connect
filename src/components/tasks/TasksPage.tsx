
import React, { useState } from "react";
import { useTasks } from "@/hooks/tasks/useTasks";
import { TaskList } from "./TaskList";
import { TaskFilters } from "./TaskFilters";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";

export function TasksPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { 
    filteredTasks, 
    isLoading, 
    searchQuery, 
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    refetch 
  } = useTasks();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Create and manage your tasks to stay productive
          </p>
        </div>
        
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>
      
      <TaskFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <TaskList tasks={filteredTasks} onRefresh={refetch} />
      )}
      
      <CreateTaskDialog 
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        userRole="individual"
      />
    </div>
  );
}
