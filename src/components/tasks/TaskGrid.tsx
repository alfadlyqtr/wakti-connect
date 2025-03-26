
import React from "react";
import TaskCard from "@/components/ui/TaskCard";
import { TaskTab, TaskWithSharedInfo } from "@/hooks/useTasks";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { addDays } from "date-fns";
import { assignTask, shareTask } from "@/services/task/sharingService";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface TaskGridProps {
  tasks: TaskWithSharedInfo[];
  userRole: "free" | "individual" | "business" | "staff" | null;
  tab: TaskTab;
  refetch?: () => void;
}

const TaskGrid = ({ tasks, userRole, tab, refetch }: TaskGridProps) => {
  const { toast } = useToast();
  const [sharingDialogOpen, setSharingDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [userIdInput, setUserIdInput] = useState("");
  const [staffIdInput, setStaffIdInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);

  // Fetch staff members when assign dialog opens
  React.useEffect(() => {
    if (assignDialogOpen && userRole === 'business') {
      fetchStaffMembers();
    }
  }, [assignDialogOpen, userRole]);

  const fetchStaffMembers = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.user) return;
      
      const { data, error } = await supabase
        .from('business_staff')
        .select('id, name, staff_id')
        .eq('business_id', session.user.id);
        
      if (error) throw error;
      
      setStaffList(data || []);
    } catch (error) {
      console.error("Error fetching staff members:", error);
      toast({
        title: "Error",
        description: "Could not fetch staff members. Please try again.",
        variant: "destructive"
      });
    }
  };

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
    setSelectedTaskId(taskId);
    setSharingDialogOpen(true);
  };

  const handleAssignTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setAssignDialogOpen(true);
  };

  const confirmShareTask = async () => {
    if (!selectedTaskId || !userIdInput) return;
    
    setIsProcessing(true);
    try {
      await shareTask(selectedTaskId, userIdInput);
      
      toast({
        title: "Task Shared",
        description: "Task has been shared successfully."
      });
      
      setSharingDialogOpen(false);
      setUserIdInput("");
      if (refetch) refetch();
    } catch (error) {
      console.error("Error sharing task:", error);
      toast({
        title: "Error",
        description: "Failed to share task. Please verify the user ID and try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmAssignTask = async () => {
    if (!selectedTaskId || !staffIdInput) return;
    
    setIsProcessing(true);
    try {
      await assignTask(selectedTaskId, staffIdInput);
      
      toast({
        title: "Task Assigned",
        description: "Task has been assigned successfully."
      });
      
      setAssignDialogOpen(false);
      setStaffIdInput("");
      if (refetch) refetch();
    } catch (error) {
      console.error("Error assigning task:", error);
      toast({
        title: "Error",
        description: "Failed to assign task. Please verify the staff ID and try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description || ""}
            dueDate={new Date(task.due_date || new Date())}
            dueTime={task.due_time}
            status={task.status}
            priority={task.priority}
            userRole={userRole}
            isAssigned={!!task.assignee_id || tab === "assigned-tasks"}
            isShared={!!task.shared_with || tab === "shared-tasks"}
            subtasks={task.subtasks || []}
            completedDate={task.completed_at ? new Date(task.completed_at) : null}
            isRecurring={!!task.is_recurring}
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

      {/* Task sharing dialog */}
      <Dialog open={sharingDialogOpen} onOpenChange={setSharingDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Task</DialogTitle>
            <DialogDescription>
              Enter the user ID of the person you want to share this task with.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="user-id">User ID</Label>
              <Input 
                id="user-id" 
                value={userIdInput} 
                onChange={(e) => setUserIdInput(e.target.value)} 
                placeholder="Enter user ID"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSharingDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmShareTask} disabled={isProcessing || !userIdInput}>
              {isProcessing ? "Sharing..." : "Share Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task assignment dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Task</DialogTitle>
            <DialogDescription>
              Select a staff member to assign this task to.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {staffList.length > 0 ? (
              <div className="grid gap-2">
                <Label htmlFor="staff-select">Staff Member</Label>
                <select
                  id="staff-select"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={staffIdInput}
                  onChange={(e) => setStaffIdInput(e.target.value)}
                >
                  <option value="">Select staff member</option>
                  {staffList.map(staff => (
                    <option key={staff.id} value={staff.staff_id}>
                      {staff.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="staff-id">Staff ID</Label>
                <Input 
                  id="staff-id" 
                  value={staffIdInput} 
                  onChange={(e) => setStaffIdInput(e.target.value)} 
                  placeholder="Enter staff ID"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmAssignTask} disabled={isProcessing || !staffIdInput}>
              {isProcessing ? "Assigning..." : "Assign Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskGrid;
