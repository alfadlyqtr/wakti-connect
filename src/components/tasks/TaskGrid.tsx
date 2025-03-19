
import React from "react";
import { Task } from "@/types/task.types";
import TaskCard from "./TaskCard";

interface TaskGridProps {
  tasks: Task[];
  showAssignee?: boolean;
  type: "my-tasks" | "shared-tasks" | "assigned-tasks";
}

const TaskGrid: React.FC<TaskGridProps> = ({ 
  tasks, 
  showAssignee = false,
  type 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          userRole="free" // This should be passed from parent component
          tab={type}
          onAction={() => {}} // This should be implemented in parent component
        />
      ))}
    </div>
  );
};

export default TaskGrid;
