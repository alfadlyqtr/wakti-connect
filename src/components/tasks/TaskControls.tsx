
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { TaskTab } from "@/types/task.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TaskControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  filterPriority: string;
  onPriorityChange: (value: string) => void;
  onCreateTask: () => void;
  currentTab: TaskTab;
  onTabChange: (value: TaskTab) => void;
  isPaidAccount: boolean;
  userRole: "free" | "individual" | "business" | "staff" | null;
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
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between items-start sm:items-center">
          <div className="w-full max-w-sm mr-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Select value={filterStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
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
            <Select value={filterPriority} onValueChange={onPriorityChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
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
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="border-t px-6 py-2">
        <Tabs 
          value={currentTab} 
          onValueChange={(value) => onTabChange(value as TaskTab)}
          className="w-full"
        >
          <TabsList className="mb-0 w-full justify-start overflow-x-auto">
            {!isStaff && <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>}
            {isPaidAccount && !isStaff && <TabsTrigger value="shared-tasks">Shared</TabsTrigger>}
            <TabsTrigger value="assigned-tasks">
              {userRole === "business" ? "Assigned Out" : "Assigned To Me"}
            </TabsTrigger>
            {userRole === "business" && <TabsTrigger value="team-tasks">Team Tasks</TabsTrigger>}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default TaskControls;
