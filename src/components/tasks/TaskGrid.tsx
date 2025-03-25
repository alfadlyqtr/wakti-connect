
import React from "react";
import TaskCard from "@/components/ui/TaskCard";
import { TaskTab, TaskWithSharedInfo } from "@/hooks/useTasks";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { addDays } from "date-fns";

interface TaskGridProps {
  tasks: TaskWithSharedInfo[];
  userRole: "free" | "individual" | "business" | "staff" | null;
  tab: TaskTab;
  refetch?: () => void;
}

const TaskGrid = ({ tasks, userRole, tab, refetch }: TaskGridProps) => {
  const { toast } = useToast();

  const handleEditTask = (taskId: string) => {
    console.log("Edit task:", taskId);
    toast({
      title: "Edit Task",
      description: "Edit functionality will be implemented soon."
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) throw error;
      
      toast({
        title: "Task Deleted",
        description: "The task has been removed successfully."
      });
      
      if (refetch) refetch();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString(),
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', taskId);
        
      if (error) throw error;
      
      toast({
        title: "Status Updated",
        description: `Task status changed to ${newStatus}.`
      });
      
      if (refetch) refetch();
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShareTask = (taskId: string) => {
    console.log("Share task:", taskId);
    toast({
      title: "Share Task",
      description: "Share functionality will be implemented soon."
    });
  };

  const handleAssignTask = (taskId: string) => {
    console.log("Assign task:", taskId);
    toast({
      title: "Assign Task",
      description: "Assignment functionality will be implemented soon."
    });
  };

  const handleSnoozeTask = async (taskId: string, days: number) => {
    try {
      const snoozedUntil = addDays(new Date(), days).toISOString();
      
      // First get the current snooze count
      const { data: taskData, error: fetchError } = await supabase
        .from('tasks')
        .select('snooze_count')
        .eq('id', taskId)
        .single();
        
      if (fetchError) {
        console.error("Error fetching task for snooze count:", fetchError);
      }
      
      // Calculate new snooze count (current + 1 or default to 1)
      const currentSnoozeCount = taskData?.snooze_count || 0;
      const newSnoozeCount = currentSnoozeCount + 1;
      
      // Now update the task with the snoozed status and incremented count
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: 'snoozed',
          snooze_count: newSnoozeCount,
          snoozed_until: snoozedUntil,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);
          
      if (error) throw error;
      
      toast({
        title: "Task Snoozed",
        description: `This task has been snoozed for ${days} day${days > 1 ? 's' : ''}.`
      });
      
      if (refetch) refetch();
    } catch (error) {
      console.error("Error snoozing task:", error);
      toast({
        title: "Error",
        description: "Failed to snooze task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubtaskToggle = async (taskId: string, subtaskIndex: number, isCompleted: boolean) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task || !task.subtasks || !task.subtasks[subtaskIndex]) {
        throw new Error("Subtask not found");
      }
      
      const subtask = task.subtasks[subtaskIndex];
      
      if (!subtask.id) {
        throw new Error("Subtask ID is missing");
      }
      
      const { error } = await supabase
        .from('todo_items')
        .update({ 
          is_completed: isCompleted,
          updated_at: new Date().toISOString()
        })
        .eq('id', subtask.id);
        
      if (error) throw error;
      
      toast({
        title: isCompleted ? "Subtask Completed" : "Subtask Reopened",
        description: "Subtask status updated successfully."
      });
      
      if (refetch) refetch();
    } catch (error) {
      console.error("Error updating subtask:", error);
      toast({
        title: "Error",
        description: "Failed to update subtask. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description || ""}
          dueDate={new Date(task.due_date || new Date())}
          status={task.status}
          priority={task.priority}
          userRole={userRole}
          isAssigned={!!task.assignee_id || tab === "assigned-tasks"}
          isShared={!!task.shared_with || tab === "shared-tasks"}
          subtasks={task.subtasks || []}
          completedDate={task.completed_at ? new Date(task.completed_at) : null}
          isRecurring={!!task.parent_recurring_id}
          isRecurringInstance={!!task.is_recurring_instance}
          snoozeCount={task.snooze_count || 0}
          snoozedUntil={task.snoozed_until ? new Date(task.snoozed_until) : null}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onShare={handleShareTask}
          onAssign={handleAssignTask}
          onSnooze={handleSnoozeTask}
          onSubtaskToggle={handleSubtaskToggle}
        />
      ))}
    </div>
  );
};

export default TaskGrid;
