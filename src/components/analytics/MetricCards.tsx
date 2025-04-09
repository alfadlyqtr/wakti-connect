
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock, AlertTriangle, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  label, 
  value, 
  icon, 
  change, 
  changeType = "neutral",
  isLoading = false
}) => {
  const changeColorClass = {
    positive: "text-green-500",
    negative: "text-red-500",
    neutral: "text-slate-500"
  }[changeType];
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <h3 className="text-2xl font-bold">
              {isLoading ? "—" : value}
            </h3>
            {change && (
              <p className={`text-xs ${changeColorClass}`}>
                {change}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const MetricCards: React.FC = () => {
  const { data: taskStats, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['metricTaskStats'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        return { total: 0, completed: 0, overdue: 0, completionRate: 0 };
      }
      
      // Get total tasks
      const { count: totalCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);
      
      // Get completed tasks
      const { count: completedCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('status', 'completed');
      
      // Get overdue tasks
      const now = new Date().toISOString();
      const { count: overdueCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .lt('due_date', now)
        .neq('status', 'completed');
      
      // Calculate completion rate
      const completionRate = totalCount > 0 
        ? Math.round((completedCount / totalCount) * 100) 
        : 0;
      
      return {
        total: totalCount || 0,
        completed: completedCount || 0,
        overdue: overdueCount || 0,
        completionRate
      };
    }
  });
  
  const { data: teamStats, isLoading: isLoadingTeam } = useQuery({
    queryKey: ['metricTeamStats'],
    queryFn: async () => {
      // Check if user is a business account
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return { members: 0 };
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.user.id)
        .single();
      
      // If not a business account, don't fetch staff data
      if (profile?.account_type !== 'business') {
        return { members: 0 };
      }
      
      // Get team members count
      const { count: staffCount } = await supabase
        .from('business_staff')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', session.user.id)
        .eq('status', 'active');
      
      return { members: staffCount || 0 };
    }
  });

  // Calculate if metrics are improving compared to last month
  // (Here we would ideally compare with historical data, but for now just show positive trends)
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard 
        label="Total Tasks" 
        value={taskStats?.total.toString() || "—"} 
        icon={<Clock className="h-6 w-6 text-primary" />}
        change={taskStats?.total ? "All your tasks" : undefined}
        changeType="neutral"
        isLoading={isLoadingTasks}
      />
      <MetricCard 
        label="Completed Tasks" 
        value={taskStats?.completed.toString() || "—"} 
        icon={<Check className="h-6 w-6 text-primary" />}
        change={taskStats?.completionRate ? `${taskStats.completionRate}% completion rate` : undefined}
        changeType="positive"
        isLoading={isLoadingTasks}
      />
      <MetricCard 
        label="Overdue Tasks" 
        value={taskStats?.overdue.toString() || "—"} 
        icon={<AlertTriangle className="h-6 w-6 text-primary" />}
        change={taskStats?.overdue ? "Require attention" : undefined}
        changeType="neutral"
        isLoading={isLoadingTasks}
      />
      <MetricCard 
        label="Team Members" 
        value={teamStats?.members.toString() || "—"} 
        icon={<Users className="h-6 w-6 text-primary" />}
        isLoading={isLoadingTeam}
      />
    </div>
  );
};
