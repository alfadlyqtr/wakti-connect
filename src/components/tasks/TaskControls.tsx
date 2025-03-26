
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskTab } from "@/types/task.types";
import { Search, Plus } from "lucide-react";

interface TaskControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: string;
  onStatusChange: (status: string) => void;
  filterPriority: string;
  onPriorityChange: (priority: string) => void;
  onCreateTask: () => void;
  currentTab: TaskTab;
  onTabChange: (tab: TaskTab) => void;
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
  isStaff,
}) => {
  const handleTabChange = (value: string) => {
    onTabChange(value as TaskTab);
  };

  return (
    <div className="space-y-4">
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
          {isPaidAccount && !isStaff && (
            <TabsTrigger value="shared-tasks">Shared Tasks</TabsTrigger>
          )}
          {(isPaidAccount || userRole === "staff") && (
            <TabsTrigger value="assigned-tasks">Assigned Tasks</TabsTrigger>
          )}
          {userRole === "business" && (
            <TabsTrigger value="team-tasks">Team Tasks</TabsTrigger>
          )}
        </TabsList>
      </Tabs>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <div className="w-full md:w-40">
            <Select value={filterStatus} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="snoozed">Snoozed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-40">
            <Select value={filterPriority} onValueChange={onPriorityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {!isStaff && (
            <Button onClick={onCreateTask}>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskControls;
