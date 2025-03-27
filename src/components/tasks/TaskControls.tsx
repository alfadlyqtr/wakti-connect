
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

interface TaskControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: TaskStatusFilter;
  onStatusChange: (status: TaskStatusFilter) => void;
  filterPriority: TaskPriorityFilter;
  onPriorityChange: (priority: TaskPriorityFilter) => void;
  onCreateTask: () => void;
  isPaidAccount: boolean;
  userRole: "free" | "individual" | "business" | "staff";
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
  return (
    <div className="flex flex-col gap-4 sm:flex-row justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
          <Input
            type="search"
            placeholder="Search tasks..."
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
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            {isPaidAccount && (
              <SelectItem value="snoozed">Snoozed</SelectItem>
            )}
          </SelectContent>
        </Select>

        <Select
          value={filterPriority}
          onValueChange={(value) => onPriorityChange(value as TaskPriorityFilter)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showCreateButton && (
        <Button onClick={onCreateTask} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      )}
    </div>
  );
};

export default TaskControls;
