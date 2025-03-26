
import React from "react";
import { Task } from "@/types/task.types";
import TaskGrid from "./TaskGrid";
import { EmptyTasks } from "./EmptyTasks";

interface TasksContainerProps {
  tasks: Task[];
  userRole: "free" | "individual" | "business" | "staff" | null;
  refetch: () => void;
  isPaidAccount: boolean;
  onCreateTask: () => void;
}

const TasksContainer: React.FC<TasksContainerProps> = ({
  tasks,
  userRole,
  refetch,
  isPaidAccount,
  onCreateTask
}) => {
  if (!tasks.length) {
    return (
      <EmptyTasks 
        isPaidAccount={isPaidAccount}
        onCreateTask={onCreateTask}
      />
    );
  }

  return (
    <TaskGrid
      tasks={tasks}
      userRole={userRole}
      refetch={refetch}
    />
  );
};

export default TasksContainer;
