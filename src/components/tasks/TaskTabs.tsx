
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, CheckSquare } from "lucide-react";
import { TaskTab } from "@/types/task.types";
import { useTranslation } from "react-i18next";

interface TaskTabsProps {
  activeTab: TaskTab;
  onTabChange: (tab: TaskTab) => void;
}

const TaskTabs: React.FC<TaskTabsProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();
  
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as TaskTab)} className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="my-tasks" className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4" />
          <span>{t("task.tabs.myTasks")}</span>
        </TabsTrigger>
        <TabsTrigger value="archived" className="flex items-center gap-2">
          <Archive className="h-4 w-4" />
          <span>{t("task.tabs.archived")}</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TaskTabs;
