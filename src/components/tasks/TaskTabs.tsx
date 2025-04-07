
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { TaskTab } from "@/types/task.types";

interface TaskTabsProps {
  activeTab: TaskTab;
  onTabChange: (tab: TaskTab) => void;
}

const TaskTabs = ({ activeTab, onTabChange }: TaskTabsProps) => {
  const { t } = useTranslation();
  
  const handleTabChange = (value: string) => {
    onTabChange(value as TaskTab);
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid grid-cols-2 w-full sm:w-[400px]">
        <TabsTrigger value="my-tasks">{t("task.tabs.myTasks")}</TabsTrigger>
        <TabsTrigger value="archived">{t("task.tabs.archived")}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TaskTabs;
