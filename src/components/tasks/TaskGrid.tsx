
import React from "react";
import TaskCard from "@/components/ui/TaskCard";
import { Task, TaskTab } from "@/types/task.types";
import { TaskWithSharedInfo } from "@/hooks/useTasks";

interface TaskGridProps {
  tasks: Task[] | TaskWithSharedInfo[];
  userRole: "free" | "individual" | "business" | "staff" | null;
  tab: TaskTab;
}

const TaskGrid = ({ tasks, userRole, tab }: TaskGridProps) => {
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
        />
      ))}
    </div>
  );
};

export default TaskGrid;
