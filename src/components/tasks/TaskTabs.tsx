
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

interface TaskTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TaskTabs = ({ activeTab, onTabChange }: TaskTabsProps) => {
  const { t } = useTranslation();
  
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-2 w-full sm:w-[400px]">
        <TabsTrigger value="my-tasks">{t("task.tabs.myTasks")}</TabsTrigger>
        <TabsTrigger value="archived">{t("task.tabs.archived")}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TaskTabs;
