
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TasksTable } from "./TasksTable";
import { TaskKanbanBoard } from "./TaskKanbanBoard";
import { TasksCalendar } from "./TasksCalendar";
import { Task } from "@/types/task.types";
import { 
  CalendarDays, 
  CheckSquare, 
  ClipboardCheck, 
  LayoutGrid, 
  ListChecks, 
  Table2 
} from "lucide-react";
import { EmptyState } from "./EmptyState";
import { TaskViewSelector } from "./TaskViewSelector";
import { ShareTabContent } from "./ShareTabContent";
import { useTranslation } from "react-i18next";

interface TaskTabsProps {
  tasks: Task[];
  loading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  refetchTasks: () => void;
}

export const TaskTabs: React.FC<TaskTabsProps> = ({
  tasks,
  loading,
  activeTab,
  setActiveTab,
  refetchTasks
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [viewType, setViewType] = useState<"table" | "kanban" | "calendar">("table");
  
  // Filter tasks based on active tab
  const getFilteredTasks = (): Task[] => {
    switch (activeTab) {
      case "my-tasks":
        return tasks.filter(task => !task.delegated_to);
      case "delegated":
        return tasks.filter(task => task.delegated_to);
      case "completed":
        return tasks.filter(task => task.status === "completed");
      case "shared":
        return tasks.filter(task => task.shared_with && task.shared_with.length > 0);
      default:
        return tasks;
    }
  };
  
  const filteredTasks = getFilteredTasks();
  
  const renderTaskContent = () => {
    if (loading) {
      return <div className="p-8 text-center">{t('common.loading')}...</div>;
    }
    
    if (filteredTasks.length === 0) {
      return <EmptyState activeTab={activeTab} />;
    }
    
    switch (viewType) {
      case "table":
        return (
          <TasksTable
            tasks={filteredTasks}
            refetchTasks={refetchTasks}
          />
        );
      case "kanban":
        return (
          <TaskKanbanBoard
            tasks={filteredTasks}
            refetchTasks={refetchTasks}
          />
        );
      case "calendar":
        return (
          <TasksCalendar
            tasks={filteredTasks}
            refetchTasks={refetchTasks}
          />
        );
    }
  };
  
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2 py-2 border-b">
        <TabsList className={`mb-2 sm:mb-0 ${isRTL ? 'sm:ml-auto' : 'sm:mr-auto'}`}>
          <TabsTrigger value="my-tasks" className="flex items-center gap-1">
            <CheckSquare className="h-4 w-4" />
            <span>{t('tasks.tabs.myTasks')}</span>
          </TabsTrigger>
          <TabsTrigger value="delegated" className="flex items-center gap-1">
            <ClipboardCheck className="h-4 w-4" />
            <span>{t('tasks.tabs.delegated')}</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-1">
            <ListChecks className="h-4 w-4" />
            <span>{t('tasks.tabs.completed')}</span>
          </TabsTrigger>
          <TabsTrigger value="shared" className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span>{t('tasks.tabs.shared')}</span>
          </TabsTrigger>
        </TabsList>
        
        {activeTab !== "shared" && (
          <TaskViewSelector
            viewType={viewType}
            setViewType={setViewType}
          />
        )}
      </div>
      
      <TabsContent value="my-tasks" className="p-0">
        {renderTaskContent()}
      </TabsContent>
      
      <TabsContent value="delegated" className="p-0">
        {renderTaskContent()}
      </TabsContent>
      
      <TabsContent value="completed" className="p-0">
        {renderTaskContent()}
      </TabsContent>
      
      <TabsContent value="shared" className="p-0">
        <ShareTabContent tasks={filteredTasks} loading={loading} />
      </TabsContent>
    </Tabs>
  );
};
