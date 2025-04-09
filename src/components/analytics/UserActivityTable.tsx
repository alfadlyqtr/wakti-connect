
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Clock, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const UserActivityTable: React.FC = () => {
  const { data: activityData, isLoading, error } = useQuery({
    queryKey: ['userActivity'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("Not authenticated");
      }
      
      // Fetch user's recently completed/updated tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('id, title, status, updated_at')
        .eq('user_id', session.user.id)
        .in('status', ['completed', 'in_progress', 'pending'])
        .order('updated_at', { ascending: false })
        .limit(5);
      
      if (tasksError) throw tasksError;
      
      // Fetch user profile for display name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, full_name, avatar_url')
        .eq('id', session.user.id)
        .single();
      
      // Process the task data into activity format
      return tasksData?.map(task => {
        let action = 'updated';
        if (task.status === 'completed') action = 'completed';
        
        const timeAgo = getTimeAgo(new Date(task.updated_at));
        
        return {
          id: task.id,
          user: { 
            name: profile?.display_name || profile?.full_name || "User", 
            avatar: profile?.avatar_url || "" 
          },
          action,
          item: task.title,
          time: timeAgo
        };
      }) || [];
    },
  });
  
  // Function to calculate time ago
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHour < 24) return `${diffHour} hours ago`;
    if (diffDay === 1) return "Yesterday";
    if (diffDay < 30) return `${diffDay} days ago`;
    return date.toLocaleDateString();
  };

  // Function to get action icon
  const getActionIcon = (action: string) => {
    switch (action) {
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />;
      case "assigned":
      case "created":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "deleted":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-slate-500" />;
    }
  };
  
  // Function to get action text
  const getActionText = (action: string, item: string) => {
    switch (action) {
      case "completed":
        return <>Completed <span className="font-medium">{item}</span></>;
      case "assigned":
        return <>Was assigned <span className="font-medium">{item}</span></>;
      case "created":
        return <>Created <span className="font-medium">{item}</span></>;
      case "updated":
        return <>Updated <span className="font-medium">{item}</span></>;
      case "deleted":
        return <>Deleted <span className="font-medium">{item}</span></>;
      default:
        return <>{action} <span className="font-medium">{item}</span></>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">Loading activity...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-destructive">Failed to load activity</p>
      </div>
    );
  }
  
  if (!activityData || activityData.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">No recent activity found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {activityData.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>
              {activity.user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center">
              <p className="text-sm font-medium">{activity.user.name}</p>
              <div className="flex items-center ml-2">
                {getActionIcon(activity.action)}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {getActionText(activity.action, activity.item)}
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
