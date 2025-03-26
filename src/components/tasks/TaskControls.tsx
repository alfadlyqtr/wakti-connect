
import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { TaskTab } from "@/types/task.types";
import { TaskStatusFilter, TaskPriorityFilter } from "./types";

interface TaskControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: TaskStatusFilter;
  onStatusChange: (value: TaskStatusFilter) => void;
  filterPriority: TaskPriorityFilter;
  onPriorityChange: (value: TaskPriorityFilter) => void;
  onCreateTask: () => void;
  currentTab: TaskTab;
  onTabChange: (value: TaskTab) => void;
  isPaidAccount: boolean;
  userRole: "free" | "individual" | "business" | "staff";
  isStaff: boolean;
}

const TaskControls: React.FC<TaskControlsProps> = ({
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
  userRole,
  isStaff
}) => {
  // Update tab handler to correctly type the value
  const handleTabChange = (value: string) => {
    onTabChange(value as TaskTab);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={filterStatus}
            onValueChange={(value: string) => onStatusChange(value as TaskStatusFilter)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="snoozed">Snoozed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filterPriority}
            onValueChange={(value: string) => onPriorityChange(value as TaskPriorityFilter)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>
          
          {!isStaff && (
            <Button onClick={onCreateTask}>
              Add Task
            </Button>
          )}
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full max-w-md grid-cols-2 md:grid-cols-4">
          {!isStaff && (
            <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
          )}
          
          {isStaff && (
            <TabsTrigger value="assigned-tasks">Assigned & Delegated</TabsTrigger>
          )}
          
          {!isStaff && isPaidAccount && (
            <>
              <TabsTrigger value="shared-tasks">Shared</TabsTrigger>
              <TabsTrigger value="assigned-tasks">Assigned</TabsTrigger>
              {userRole === "business" && (
                <TabsTrigger value="team-tasks">Team</TabsTrigger>
              )}
            </>
          )}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TaskControls;
