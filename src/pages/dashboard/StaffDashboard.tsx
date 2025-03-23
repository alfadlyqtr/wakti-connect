
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import StaffDashboardHeader from "@/components/dashboard/StaffDashboardHeader";
import { useStaffStatus } from "@/hooks/staff/useStaffStatus";
import { Users, BookOpen, Clock, Calendar, Briefcase, AlertCircle } from "lucide-react";
import WorkStatusCard from "@/components/staff/WorkStatusCard";
import ActiveWorkSession from "@/components/staff/ActiveWorkSession";
import WorkHistory from "@/components/staff/WorkHistory";

interface StaffPermissions {
  can_view_tasks?: boolean;
  can_manage_tasks?: boolean;
  can_message_staff?: boolean;
  can_manage_bookings?: boolean;
  can_create_job_cards?: boolean;
  can_track_hours?: boolean;
  can_log_earnings?: boolean;
  can_edit_profile?: boolean;
  can_view_customer_bookings?: boolean;
  can_view_analytics?: boolean;
  [key: string]: boolean | undefined;
}

const StaffDashboard = () => {
  const { isStaff, staffRelationId } = useStaffStatus();
  const [activeWorkSession, setActiveWorkSession] = useState<any | null>(null);
  
  const { data: staffData, isLoading, error } = useQuery({
    queryKey: ['staffDetails', staffRelationId],
    queryFn: async () => {
      if (!staffRelationId) return null;
      
      try {
        const { data, error } = await supabase
          .from('business_staff')
          .select(`
            *,
            business:business_id (
              business_name,
              avatar_url
            )
          `)
          .eq('id', staffRelationId)
          .single();
          
        if (error) throw error;
        
        // Parse permissions JSON to an object if it's a string
        if (data) {
          try {
            if (typeof data.permissions === 'string') {
              data.permissions = JSON.parse(data.permissions);
            } else if (typeof data.permissions !== 'object') {
              data.permissions = {}; // Default empty object if not valid
            }
          } catch (e) {
            console.error("Error parsing permissions:", e);
            data.permissions = {}; // Default to empty object on parse error
          }
        }
        
        return data;
      } catch (e) {
        console.error("Error fetching staff details:", e);
        throw e;
      }
    },
    enabled: !!staffRelationId
  });
  
  const { data: { user } = { user: null } } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data;
    }
  });
  
  // Fetch active work session
  useEffect(() => {
    const fetchActiveWorkSession = async () => {
      if (!staffRelationId) return;
      
      try {
        console.log("Fetching active work session for staff relation:", staffRelationId);
        
        const { data: activeSessions, error: sessionsError } = await supabase
          .from('staff_work_logs')
          .select('*')
          .eq('staff_relation_id', staffRelationId)
          .is('end_time', null)
          .eq('status', 'active')
          .maybeSingle();
          
        if (sessionsError) {
          console.error("Error fetching active work session:", sessionsError);
          return;
        }
        
        console.log("Active work session:", activeSessions);
        setActiveWorkSession(activeSessions);
      } catch (error: any) {
        console.error("Error fetching active work session:", error);
      }
    };
    
    if (staffRelationId) {
      fetchActiveWorkSession();
    }
  }, [staffRelationId]);
  
  // Start/End work session
  const startWorkDay = async () => {
    if (!staffRelationId) return;
    
    try {
      console.log("Starting work day for staff relation:", staffRelationId);
      
      const { data, error } = await supabase
        .from('staff_work_logs')
        .insert({
          staff_relation_id: staffRelationId,
          start_time: new Date().toISOString(),
          status: 'active'
        })
        .select()
        .single();
        
      if (error) {
        console.error("Error starting work day:", error);
        return;
      }
      
      console.log("Work day started:", data);
      setActiveWorkSession(data);
    } catch (error: any) {
      console.error("Error starting work day:", error);
    }
  };
  
  const endWorkDay = async () => {
    if (!activeWorkSession) return;
    
    try {
      console.log("Ending work day for session:", activeWorkSession.id);
      
      const { data, error } = await supabase
        .from('staff_work_logs')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed'
        })
        .eq('id', activeWorkSession.id)
        .select()
        .single();
        
      if (error) {
        console.error("Error ending work day:", error);
        return;
      }
      
      console.log("Work day ended:", data);
      setActiveWorkSession(null);
    } catch (error: any) {
      console.error("Error ending work day:", error);
    }
  };
  
  const { data: stats, error: statsError } = useQuery({
    queryKey: ['staffStats', staffRelationId],
    queryFn: async () => {
      if (!staffRelationId || !user) return null;
      
      try {
        // Get tasks count
        const { count: tasksCount, error: tasksError } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('assignee_id', user.id);
          
        if (tasksError) throw tasksError;
        
        // Get bookings count
        const { count: bookingsCount, error: bookingsError } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('staff_assigned_id', user.id);
          
        if (bookingsError) throw bookingsError;
        
        // Get work logs count
        const { count: workLogsCount, error: workLogsError } = await supabase
          .from('staff_work_logs')
          .select('*', { count: 'exact', head: true })
          .eq('staff_relation_id', staffRelationId);
          
        if (workLogsError) throw workLogsError;
        
        // Get job cards count
        const { count: jobCardsCount, error: jobCardsError } = await supabase
          .from('job_cards')
          .select('*', { count: 'exact', head: true })
          .eq('staff_relation_id', staffRelationId);
          
        if (jobCardsError) throw jobCardsError;
        
        return {
          tasksCount: tasksCount || 0,
          bookingsCount: bookingsCount || 0,
          workLogsCount: workLogsCount || 0,
          jobCardsCount: jobCardsCount || 0
        };
      } catch (error) {
        console.error("Error fetching staff stats:", error);
        return {
          tasksCount: 0,
          bookingsCount: 0,
          workLogsCount: 0,
          jobCardsCount: 0
        };
      }
    },
    enabled: !!staffRelationId && !!user
  });
  
  if (!isStaff) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-2xl font-medium">Not a Staff Account</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            This dashboard is only available for staff accounts. If you're a staff member, 
            please contact your business administrator.
          </p>
        </div>
      </Card>
    );
  }
  
  if (isLoading || !staffData) {
    return <div className="py-8 text-center">Loading staff dashboard...</div>;
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-2xl font-medium">Error Loading Dashboard</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            We encountered a problem loading your staff dashboard. Please try again or contact support.
          </p>
          <pre className="mt-4 p-4 bg-muted text-xs overflow-auto max-w-md">
            {error.message || "Unknown error"}
          </pre>
        </div>
      </Card>
    );
  }
  
  const permissions = staffData.permissions as StaffPermissions || {};
  const businessInfo = staffData.business as any || {};
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Staff Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your staff dashboard. Manage your tasks, bookings, and track your work.
        </p>
      </div>
      
      {user && <StaffDashboardHeader staffId={user.id} />}
      
      {/* Work Status Section */}
      {permissions.can_track_hours && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Work Day Tracking</h2>
          <WorkStatusCard 
            activeWorkSession={activeWorkSession}
            onStartWorkDay={startWorkDay}
            onEndWorkDay={endWorkDay}
            onCreateJobCard={() => window.location.href = "/dashboard/job-cards"}
          />
          <ActiveWorkSession session={activeWorkSession} />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {permissions.can_view_tasks && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-wakti-blue" />
                Tasks
              </CardTitle>
              <CardDescription>Assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.tasksCount || 0}</p>
            </CardContent>
          </Card>
        )}
        
        {permissions.can_manage_bookings && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-wakti-blue" />
                Bookings
              </CardTitle>
              <CardDescription>Your appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.bookingsCount || 0}</p>
            </CardContent>
          </Card>
        )}
        
        {permissions.can_track_hours && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2 text-wakti-blue" />
                Work Logs
              </CardTitle>
              <CardDescription>Your work sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.workLogsCount || 0}</p>
            </CardContent>
          </Card>
        )}
        
        {permissions.can_create_job_cards && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-wakti-blue" />
                Job Cards
              </CardTitle>
              <CardDescription>Completed jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.jobCardsCount || 0}</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {permissions.can_track_hours && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Recent Work History</h2>
          <Card>
            <CardContent className="p-6">
              <WorkHistory staffRelationId={staffRelationId} limit={5} />
            </CardContent>
          </Card>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Your Permissions</CardTitle>
          <CardDescription>Here are the features you have access to:</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(permissions)
              .filter(([_, value]) => value)
              .map(([key]) => (
                <div key={key} className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-wakti-blue"></div>
                  <span className="text-sm">
                    {key.replace('can_', '').replace(/_/g, ' ')}
                  </span>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffDashboard;
