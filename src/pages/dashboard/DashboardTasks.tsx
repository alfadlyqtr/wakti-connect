import React, { useState, useEffect, useCallback } from "react";
import { TaskTabs } from "@/components/tasks/TaskTabs";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/types/task.types";
import { Card } from "@/components/ui/card";
import { useTask } from "@/hooks/useTask";
import { ErrorPage } from "../error";
import { Button } from "@/components/ui/button"; 
import { Plus } from "lucide-react";
import { CreateEditTaskDialog } from "@/components/tasks/CreateEditTaskDialog";
import { TaskFilterMenu } from "@/components/tasks/TaskFilterMenu";
import { TaskSortMenu } from "@/components/tasks/TaskSortMenu";
import { useTranslation } from "react-i18next";

export type TaskFilterType = "all" | "priority" | "status";

const DashboardTasks = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { getTasks, error, loading } = useTask();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<TaskFilterType>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab] = useState<string>("my-tasks");

  const fetchTasks = useCallback(async () => {
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (e: any) {
      toast({
        title: t("common.error"),
        description: t("tasks.fetchError"),
        variant: "destructive",
      });
    }
  }, [getTasks, toast, t]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const refetchTasks = () => {
    fetchTasks();
  };

  const handleTaskCreated = () => {
    setShowCreateTask(false);
    refetchTasks();
    toast({
      title: t("common.success"),
      description: t("tasks.taskCreated"),
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">{t('tasks.title')}</h1>
          <p className="text-muted-foreground">{t('tasks.subtitle')}</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <div className="flex items-center space-x-2">
            <TaskFilterMenu 
              currentFilter={currentFilter} 
              onFilterChange={setCurrentFilter} 
            />
            <TaskSortMenu 
              currentOrder={sortOrder} 
              onOrderChange={setSortOrder} 
            />
          </div>
          <Button 
            onClick={() => setShowCreateTask(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> {t('tasks.newTask')}
          </Button>
        </div>
      </header>

      {error && <ErrorPage message={error} />}

      <Card>
        <TaskTabs
          tasks={tasks}
          loading={loading}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          refetchTasks={refetchTasks}
        />
      </Card>

      <CreateEditTaskDialog
        open={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        onSuccessfulSubmit={handleTaskCreated}
      />
    </div>
  );
};

export default DashboardTasks;
