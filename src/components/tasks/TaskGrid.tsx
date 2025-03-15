
import React from "react";
import TaskCard from "@/components/ui/TaskCard";
import { Task } from "@/hooks/useTasks";

interface TaskGridProps {
  tasks: Task[];
  userRole: "free" | "individual" | "business" | null;
}

const TaskGrid = ({ tasks, userRole }: TaskGridProps) => {
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
          category="Personal" // This would come from labels in a real implementation
          userRole={userRole || "free"}
        />
      ))}
    </div>
  );
};

export default TaskGrid;
