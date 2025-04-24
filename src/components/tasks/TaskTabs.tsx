
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskTab } from "@/types/task.types";

interface TaskTabsProps {
  activeTab: TaskTab;
  onTabChange: (tab: TaskTab) => void;
}

const TaskTabs = ({ activeTab, onTabChange }: TaskTabsProps) => {
  const handleTabChange = (value: string) => {
    onTabChange(value as TaskTab);
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid grid-cols-3 w-full sm:w-[600px]">
        <TabsTrigger value="my-tasks">Active Tasks</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="reminders">Reminders</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TaskTabs;
