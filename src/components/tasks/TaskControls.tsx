
import React from "react";
import { Plus, Search } from "lucide-react";
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
import { TaskTab } from "@/hooks/useTasks";

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
  if (!isPaidAccount) return null;

  const showAssignedTab = userRole === "business" || userRole === "individual";
  
  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue={currentTab} 
        onValueChange={(value) => onTabChange(value as TaskTab)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="shared-tasks">Shared Tasks</TabsTrigger>
          <TabsTrigger value="assigned-tasks">
            {userRole === "business" ? "Team Tasks" : "Assigned Tasks"}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={filterStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="late">Late</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterPriority} onValueChange={onPriorityChange}>
            <SelectTrigger className="w-full sm:w-32">
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
          
          <Button onClick={onCreateTask} className="flex items-center gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">
              {currentTab === "assigned-tasks" && userRole === "business" 
                ? "Assign Task" 
                : "Create Task"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskControls;
