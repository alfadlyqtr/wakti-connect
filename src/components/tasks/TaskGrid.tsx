
import React from "react";
import TaskCard from "@/components/ui/TaskCard";
import { Task, TaskTab } from "@/types/task.types";
import { useIsMobile } from "@/hooks/useResponsive";

interface TaskGridProps {
  tasks: Task[];
  userRole: "free" | "individual" | "business" | null;
  tab: TaskTab;
}

const TaskGrid = ({ tasks, userRole, tab }: TaskGridProps) => {
  const isMobile = useIsMobile();
  
  if (tasks.length === 0) return null;
  
  return (
    <div className={cn(
      "grid gap-4",
      isMobile 
        ? "grid-cols-1" 
        : "md:grid-cols-2 lg:grid-cols-3"
    )}>
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

// Add missing import
const { cn } = require("@/lib/utils");

export default TaskGrid;
