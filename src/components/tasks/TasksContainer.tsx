
import React from "react";
import { TaskTab } from "@/types/task.types";
import EmptyTasksState from "./EmptyTasksState";
import TaskGrid from "./TaskGrid";

interface TasksContainerProps {
  tasks: any[];
  userRole: "free" | "individual" | "business" | "staff" | null;
  tab: TaskTab;
  refetch: () => void;
  isPaidAccount: boolean;
  isStaff: boolean;
  onCreateTask: () => void;
}

const TasksContainer: React.FC<TasksContainerProps> = ({
  tasks,
  userRole,
  tab,
  refetch,
  isPaidAccount,
  isStaff,
  onCreateTask
}) => {
  const isEmpty = tasks.length === 0;
  
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      {isEmpty ? (
        <EmptyTasksState 
          isPaidAccount={isPaidAccount} 
          onCreateTask={onCreateTask} 
          tab={tab}
          isStaff={isStaff}
        />
      ) : (
        <TaskGrid 
          tasks={tasks} 
          userRole={userRole} 
          tab={tab}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default TasksContainer;
