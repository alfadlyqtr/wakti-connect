
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const DashboardTasks = () => {
  const [userRole, setUserRole] = useState<"free" | "individual" | "business" | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('account_type')
            .eq('id', session.user.id)
            .single();
          
          if (profileData?.account_type) {
            setUserRole(profileData.account_type as "free" | "individual" | "business");
            console.log("Task page - user role:", profileData.account_type);
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserRole();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        getUserRole();
      } else if (event === 'SIGNED_OUT') {
        setUserRole(null);
      }
    });

    // In a real app, we would fetch tasks from the API
    // For now, just setting empty array
    setTasks([]);

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const isPaidAccount = userRole === "individual" || userRole === "business";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          Manage your tasks and track your progress.
        </p>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
          </div>
        ) : tasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Task cards would go here */}
            <p>Your tasks will appear here</p>
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
              You haven't created any tasks yet. Start by creating a new task to organize your work.
            </p>
            {isPaidAccount ? (
              <Button className="flex items-center gap-2">
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
