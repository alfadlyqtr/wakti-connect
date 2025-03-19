
import React from "react";
import { Plus, Search, UserPlus, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskTab } from "@/types/task.types";
import { useTranslation } from "react-i18next";

interface TaskControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  filterPriority: string;
  onPriorityChange: (value: string) => void;
  onCreateTask: () => void;
  currentTab: TaskTab;
  onTabChange: (tab: TaskTab) => void;
  isPaidAccount: boolean;
  userRole: "free" | "individual" | "business";
}

const TaskControls = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterPriority,
  onPriorityChange,
  onCreateTask,
  currentTab,
  onTabChange,
  isPaidAccount,
  userRole
}: TaskControlsProps) => {
  const { t } = useTranslation();

  if (!isPaidAccount) return null;

  // Get the appropriate button text and icon based on the active tab
  const getButtonContent = () => {
    switch(currentTab) {
      case 'shared-tasks':
        return {
          text: t('task.createSharedTask'),
          icon: <Share size={16} />
        };
      case 'assigned-tasks':
        return {
          text: userRole === "business" ? t('task.assignTask') : t('task.createTask'),
          icon: userRole === "business" ? <UserPlus size={16} /> : <Plus size={16} />
        };
      default:
        return {
          text: t('task.createTask'),
          icon: <Plus size={16} />
        };
    }
  };

  const buttonContent = getButtonContent();
  
  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue={currentTab} 
        onValueChange={(value) => onTabChange(value as TaskTab)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-tasks">{t('task.myTasks')}</TabsTrigger>
          <TabsTrigger value="shared-tasks">{t('task.sharedTasks')}</TabsTrigger>
          <TabsTrigger value="assigned-tasks">
            {userRole === "business" ? t('task.teamTasks') : t('task.assignedTasks')}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t('task.searchTasks')}
            className="pl-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={filterStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder={t('task.status.label')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('task.status.all')}</SelectItem>
              <SelectItem value="pending">{t('task.status.pending')}</SelectItem>
              <SelectItem value="in-progress">{t('task.status.inProgress')}</SelectItem>
              <SelectItem value="completed">{t('task.status.completed')}</SelectItem>
              <SelectItem value="late">{t('task.status.late')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterPriority} onValueChange={onPriorityChange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder={t('task.priority.label')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('task.priority.all')}</SelectItem>
              <SelectItem value="urgent">{t('task.priority.urgent')}</SelectItem>
              <SelectItem value="high">{t('task.priority.high')}</SelectItem>
              <SelectItem value="medium">{t('task.priority.medium')}</SelectItem>
              <SelectItem value="normal">{t('task.priority.normal')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={onCreateTask} className="flex items-center gap-2">
            {buttonContent.icon}
            <span className="hidden sm:inline">{buttonContent.text}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskControls;
