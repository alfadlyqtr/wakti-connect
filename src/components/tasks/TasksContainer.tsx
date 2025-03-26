
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
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      {tasks.length > 0 ? (
        <TaskGrid 
          tasks={tasks} 
          userRole={userRole} 
          tab={tab}
          refetch={refetch}
        />
      ) : (
        <EmptyTasksState 
          isPaidAccount={isPaidAccount} 
          onCreateTask={onCreateTask} 
          tab={tab}
          isStaff={isStaff}
        />
      )}
    </div>
  );
};

export default TasksContainer;
