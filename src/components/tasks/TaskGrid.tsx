
import React from "react";
import { Task } from "@/types/task.types";
import TaskCard from "./TaskCard";

interface TaskGridProps {
  tasks: Task[];
  userRole: string | null;
  tab: "my-tasks" | "shared-tasks" | "assigned-tasks";
  onTaskAction: (action: string, taskId: string) => void;
}

const TaskGrid: React.FC<TaskGridProps> = ({ 
  tasks, 
  userRole,
  tab,
  onTaskAction
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          userRole={userRole as "free" | "individual" | "business"} 
          tab={tab}
          onAction={onTaskAction}
        />
      ))}
    </div>
  );
};

export default TaskGrid;
