
import React from "react";
import { Task, TaskTab } from "@/types/task.types";
import TaskCard from "@/components/ui/TaskCard";

interface TaskGridProps {
  tasks: Task[];
  userRole: "free" | "individual" | "business" | "staff" | null;
  tab: TaskTab;
  refetch: () => void;
}

const TaskGrid: React.FC<TaskGridProps> = ({ tasks, userRole, tab, refetch }) => {
  // Determine if tasks are editable
  const isEditable = (task: Task) => {
    // Business users can edit all tasks they created, including team tasks
    if (userRole === "business") {
      return true;
    }
    
    // Staff can edit tasks assigned to them or that they claimed
    if (userRole === "staff") {
      return task.assignee_id === localStorage.getItem('userId') || 
             tab === "assigned-tasks";
    }
    
    // For regular users, they can't edit team tasks
    return !task.is_team_task;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description || ""}
          dueDate={new Date(task.due_date || "")}
          dueTime={task.due_time}
          status={task.status}
          priority={task.priority}
          userRole={userRole}
          isAssigned={!!task.assignee_id}
          isShared={!!task.delegated_to}
          subtasks={task.subtasks || []}
          completedDate={task.completed_at ? new Date(task.completed_at) : null}
          isRecurring={task.is_recurring}
          isRecurringInstance={task.is_recurring_instance}
          snoozeCount={task.snooze_count}
          snoozedUntil={task.snoozed_until ? new Date(task.snoozed_until) : null}
          delegatedEmail={task.delegated_email}
          assigneeId={task.assignee_id}
          refetch={refetch}
          onEdit={(id) => console.log("Edit task", id)}
          onDelete={(id) => console.log("Delete task", id)}
          onStatusChange={(id, status) => console.log("Change status", id, status)}
          onShare={(id) => console.log("Share task", id)}
          onAssign={(id) => console.log("Assign task", id)}
          onSnooze={(id, days) => console.log("Snooze task", id, days)}
          onSubtaskToggle={(taskId, subtaskIndex, isCompleted) => console.log("Toggle subtask", taskId, subtaskIndex, isCompleted)}
        />
      ))}
    </div>
  );
};

export default TaskGrid;
