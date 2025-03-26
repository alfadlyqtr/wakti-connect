
import React from "react";
import { Task, TaskTab } from "@/types/task.types";
import TaskGrid from "./TaskGrid";
import { EmptyTasks } from "./EmptyTasks";

interface TasksContainerProps {
  tasks: Task[];
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
  if (!tasks.length) {
    return (
      <EmptyTasks 
        tab={tab}
        isPaidAccount={isPaidAccount}
        isStaff={isStaff}
        onCreateTask={onCreateTask}
      />
    );
  }

  return (
    <TaskGrid
      tasks={tasks}
      userRole={userRole}
      tab={tab}
      refetch={refetch}
    />
  );
};

export default TasksContainer;
