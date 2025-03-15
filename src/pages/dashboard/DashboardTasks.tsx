
import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TaskCard from "@/components/ui/TaskCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

// Define Task type based on our database schema
interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "in-progress" | "completed" | "late";
  priority: "urgent" | "high" | "medium" | "normal";
  due_date: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const DashboardTasks = () => {
  const [userRole, setUserRole] = useState<"free" | "individual" | "business" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  // Fetch tasks with React Query for better caching and refetching
  const { data: tasks, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.user.id)
        .single();
      
      setUserRole(profileData?.account_type || "free");
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('due_date', { ascending: true });
      
      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
      
      return data as Task[];
    },
    // Don't refetch automatically on window focus for this demo
    refetchOnWindowFocus: false,
  });

  // Show error toast if query fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Failed to load tasks",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  }, [error]);

  const isPaidAccount = userRole === "individual" || userRole === "business";

  // Filter tasks based on search and filters
  const filteredTasks = tasks?.filter((task) => {
    // Search filter
    const matchesSearch = searchQuery 
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    
    // Status filter
    const matchesStatus = filterStatus === "all" ? true : task.status === filterStatus;
    
    // Priority filter
    const matchesPriority = filterPriority === "all" ? true : task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  }) || [];

  const handleCreateTask = async () => {
    if (!isPaidAccount) return;
    
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create tasks",
          variant: "destructive",
        });
        return;
      }

      // In a real implementation, this would open a modal form
      // For now, create a sample task
      const newTask = {
        user_id: session.user.id,
        title: "New Task",
        description: "Click to edit this task",
        status: "pending",
        priority: "normal",
        due_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Task Created",
        description: "New task has been created successfully",
      });

      // Refetch tasks to update the list
      refetch();
    } catch (error: any) {
      toast({
        title: "Failed to create task",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your tasks and track your progress.
          </p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
            <span className="ml-2">Loading tasks...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          Manage your tasks and track your progress.
        </p>
      </div>
      
      {isPaidAccount && (
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
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
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
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
            
            <Button onClick={handleCreateTask} className="flex items-center gap-2">
              <Plus size={16} />
              <span className="hidden sm:inline">Create Task</span>
            </Button>
          </div>
        </div>
      )}
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        {filteredTasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description || ""}
                dueDate={task.due_date ? new Date(task.due_date) : new Date()}
                status={task.status}
                priority={task.priority}
                category="Personal" // This would come from labels in a real implementation
                userRole={userRole || "free"}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M8 12h8M12 8v8" />
            </svg>
            <h3 className="text-lg font-semibold">No tasks found</h3>
            <p className="text-center text-sm text-muted-foreground max-w-xs">
              {isPaidAccount 
                ? "You haven't created any tasks yet. Start by creating a new task to organize your work."
                : "Free accounts can only view tasks. Upgrade to create and manage tasks."}
            </p>
            {isPaidAccount ? (
              <Button onClick={handleCreateTask} className="flex items-center gap-2">
                <Plus size={16} />
                Create New Task
              </Button>
            ) : (
              <div className="text-center">
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 mb-2">
                  View Only
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Upgrade to create and manage tasks
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTasks;
