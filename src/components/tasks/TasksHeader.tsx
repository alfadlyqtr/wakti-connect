
import React from "react";

interface TasksHeaderProps {
  isStaffMember: boolean;
}

const TasksHeader: React.FC<TasksHeaderProps> = ({ isStaffMember }) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
      <p className="text-muted-foreground">
        {isStaffMember 
          ? "View and manage tasks assigned to you by your business"
          : "Create and manage your tasks to stay productive"}
      </p>
    </div>
  );
};

export default TasksHeader;
