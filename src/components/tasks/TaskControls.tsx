
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import { TaskStatusFilter, TaskPriorityFilter } from "./types";
import { UserRole } from "@/types/user";
import { useTranslation } from "react-i18next";

interface TaskControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: TaskStatusFilter;
  onStatusChange: (status: TaskStatusFilter) => void;
  filterPriority: TaskPriorityFilter;
  onPriorityChange: (priority: TaskPriorityFilter) => void;
  onCreateTask: () => void;
  isPaidAccount: boolean;
  userRole: UserRole;
  showCreateButton?: boolean;
}

const TaskControls: React.FC<TaskControlsProps> = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterPriority,
  onPriorityChange,
  onCreateTask,
  isPaidAccount,
  userRole,
  showCreateButton = true
}) => {
  const { t, i18n } = useTranslation();
  
  return (
    <div className="flex flex-col gap-4 sm:flex-row justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
          <Input
            type="search"
            placeholder={t("common.search")}
            className="pl-8 w-full sm:max-w-[300px]"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Select
          value={filterStatus}
          onValueChange={(value) => onStatusChange(value as TaskStatusFilter)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder={t("task.status.status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("task.status.all")}</SelectItem>
            <SelectItem value="pending">{t("task.status.pending")}</SelectItem>
            <SelectItem value="in-progress">{t("task.status.inProgress")}</SelectItem>
            <SelectItem value="completed">{t("task.status.completed")}</SelectItem>
            {isPaidAccount && (
              <SelectItem value="snoozed">{t("task.status.snoozed")}</SelectItem>
            )}
          </SelectContent>
        </Select>

        <Select
          value={filterPriority}
          onValueChange={(value) => onPriorityChange(value as TaskPriorityFilter)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder={t("task.priority.priority")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("task.priority.all")}</SelectItem>
            <SelectItem value="urgent">{t("task.priority.urgent")}</SelectItem>
            <SelectItem value="high">{t("task.priority.high")}</SelectItem>
            <SelectItem value="medium">{t("task.priority.medium")}</SelectItem>
            <SelectItem value="normal">{t("task.priority.normal")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showCreateButton && userRole !== "staff" && (
        <Button onClick={onCreateTask} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          {t("task.createTask")}
        </Button>
      )}
    </div>
  );
};

export default TaskControls;
