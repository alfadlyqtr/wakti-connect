
import React from "react";
import TaskCard from "@/components/ui/TaskCard";
import { Task, TaskTab } from "@/types/task.types";

interface TaskGridProps {
  tasks: Task[];
  userRole: "free" | "individual" | "business" | null;
  tab: TaskTab;
  onTaskAction?: (action: string, taskId: string) => void;
}

const TaskGrid = ({ tasks, userRole, tab, onTaskAction }: TaskGridProps) => {
  if (tasks.length === 0) return null;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description || ""}
          dueDate={task.due_date ? new Date(task.due_date) : new Date()}
          status={task.status}
          priority={task.priority}
          category={tab === "assigned-tasks" ? "Assigned" : tab === "shared-tasks" ? "Shared" : "Personal"}
          userRole={userRole || "free"}
          isAssigned={tab === "assigned-tasks"}
          isShared={tab === "shared-tasks"}
          isRecurring={Boolean(task.parent_recurring_id)}
          isRecurringInstance={Boolean(task.is_recurring_instance)}
          subtasks={task.subtasks}
          onShare={() => onTaskAction && onTaskAction("share", task.id)}
          onAssign={() => onTaskAction && onTaskAction("assign", task.id)}
          onEdit={() => onTaskAction && onTaskAction("edit", task.id)}
          onDelete={() => onTaskAction && onTaskAction("delete", task.id)}
          onMarkComplete={() => onTaskAction && onTaskAction("complete", task.id)}
          onMarkPending={() => onTaskAction && onTaskAction("pending", task.id)}
          onAddSubtask={() => onTaskAction && onTaskAction("addSubtask", task.id)}
        />
      ))}
    </div>
  );
};

export default TaskGrid;
