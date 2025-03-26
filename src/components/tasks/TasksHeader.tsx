
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
          ? "View and manage tasks assigned or delegated to you."
          : "Manage your tasks and track your progress."}
      </p>
    </div>
  );
};

export default TasksHeader;
