
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStaffStatus } from "@/hooks/useStaffStatus";
import { Briefcase, Calendar, CheckSquare, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import StaffWelcomeMessage from "@/components/staff/StaffWelcomeMessage";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StaffDashboard = () => {
  const { isStaff, businessId, staffRelationId, isLoading } = useStaffStatus();
  
  // Fix: Use the getUser() method correctly with async/await pattern
  const { data: userData } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    }
  });
  
  // Get task and shift counts
  const { data: counts } = useQuery({
    queryKey: ['staffCounts', staffRelationId],
    queryFn: async () => {
      if (!staffRelationId || !userData?.id) return { tasks: 0, shifts: 0 };
      
      try {
        // Get pending task count
        const { count: taskCount, error: taskError } = await supabase
          .from('tasks')
          .select('id', { count: 'exact', head: true })
          .eq('assignee_id', userData.id)
          .eq('status', 'pending');
          
        // Get active shifts count
        const { count: shiftCount, error: shiftError } = await supabase
          .from('staff_work_logs')
          .select('id', { count: 'exact', head: true })
          .eq('staff_relation_id', staffRelationId)
          .eq('status', 'active');
          
        return {
          tasks: taskCount || 0,
          shifts: shiftCount || 0
        };
      } catch (error) {
        console.error("Error fetching staff counts:", error);
        return { tasks: 0, shifts: 0 };
      }
    },
    enabled: !!staffRelationId && !!userData?.id
  });
  
  if (isLoading) {
    return <div className="space-y-6 animate-pulse">
      <div className="h-20 bg-muted rounded-lg w-full"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-40 bg-muted rounded-lg"></div>
        <div className="h-40 bg-muted rounded-lg"></div>
        <div className="h-40 bg-muted rounded-lg"></div>
      </div>
    </div>;
  }
  
  if (!isStaff) {
    return <div className="text-center py-10">
      <p className="text-muted-foreground">You are not registered as a staff member.</p>
    </div>;
  }

  return (
    <div className="space-y-6">
      <StaffWelcomeMessage businessId={businessId} staffId={userData?.id || null} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <CheckSquare className="mr-2 h-5 w-5 text-wakti-blue" />
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-3">{counts?.tasks || 0}</p>
            <p className="text-muted-foreground text-sm mb-4">Pending tasks assigned to you</p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/dashboard/tasks">View Tasks</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Calendar className="mr-2 h-5 w-5 text-green-600" />
              Work Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-3">{counts?.shifts || 0}</p>
            <p className="text-muted-foreground text-sm mb-4">Active work sessions</p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/dashboard/work-logs">Manage Shifts</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <MessageSquare className="mr-2 h-5 w-5 text-purple-600" />
              Communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">Stay connected with your team</p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/dashboard/messages">Messages</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/dashboard/contacts">Contacts</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffDashboard;
