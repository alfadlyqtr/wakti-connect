
import React from "react";
import { TaskWithSharedInfo } from "@/hooks/tasks/types";
import { TaskTab } from "@/types/task.types";
import TaskCard from "@/components/ui/TaskCard";

interface TaskGridProps {
  tasks: TaskWithSharedInfo[];
  userRole: "free" | "individual" | "business" | "staff" | null;
  tab: TaskTab;
  refetch: () => void;
}

const TaskGrid: React.FC<TaskGridProps> = ({ tasks, userRole, tab, refetch }) => {
  const handleEditTask = (id: string) => {
    console.log("Edit task:", id);
    // Implement edit functionality
  };

  const handleDeleteTask = (id: string) => {
    console.log("Delete task:", id);
    // Implement delete functionality
  };

  const handleStatusChange = (id: string, status: string) => {
    console.log("Change status:", id, status);
    // Implement status change functionality
  };

  const handleShareTask = (id: string) => {
    console.log("Share task:", id);
    // Implement share functionality
  };

  const handleAssignTask = (id: string) => {
    console.log("Assign task:", id);
    // Implement assign functionality
  };

  const handleSnoozeTask = (id: string, days: number) => {
    console.log("Snooze task:", id, "for", days, "days");
    // Implement snooze functionality
  };

  const handleSubtaskToggle = (taskId: string, subtaskIndex: number, isCompleted: boolean) => {
    console.log("Toggle subtask:", taskId, subtaskIndex, isCompleted);
    // Implement subtask toggle functionality
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description || ""}
          dueDate={task.due_date ? new Date(task.due_date) : new Date()}
          dueTime={task.due_time}
          status={task.status}
          priority={task.priority}
          userRole={userRole}
          isAssigned={!!task.assignee_id}
          isShared={!!task.shared_with}
          subtasks={task.subtasks || []}
          completedDate={task.completed_at ? new Date(task.completed_at) : null}
          isRecurring={task.is_recurring}
          isRecurringInstance={task.is_recurring_instance}
          snoozeCount={task.snooze_count}
          snoozedUntil={task.snoozed_until ? new Date(task.snoozed_until) : null}
          delegatedEmail={task.delegated_email}
          assigneeId={task.assignee_id}
          refetch={refetch}
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
