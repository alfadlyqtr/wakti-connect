
import React from "react";
import { Task, TaskTab } from "@/types/task.types";
import TaskCard from "./TaskCard";

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
          task={task}
          userRole={userRole}
          isEditable={isEditable(task)}
          refetch={refetch}
          tab={tab}
        />
      ))}
    </div>
  );
};

export default TaskGrid;
