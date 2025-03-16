
import React, { useState } from "react";
import { useStaffWorkLogs } from "@/hooks/useStaffWorkLogs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateJobCardDialog from "@/components/jobs/CreateJobCardDialog";
import JobCardsList from "@/components/jobs/JobCardsList";
import { StaffWorkSessionTable } from "@/components/staff/StaffWorkSessionTable";

const DashboardJobCards = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [staffRelationId, setStaffRelationId] = useState<string | null>(null);
  const [activeWorkSession, setActiveWorkSession] = useState<any | null>(null);
  
  // Fetch staff relation ID for the current user
  React.useEffect(() => {
    const getStaffRelation = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        const { data, error } = await supabase
          .from('business_staff')
          .select('id')
          .eq('staff_id', user.id)
          .single();
          
        if (error) throw error;
        
        setStaffRelationId(data.id);
        
        // Also check for active work session
        const { data: activeSessions, error: sessionsError } = await supabase
          .from('staff_work_logs')
          .select('*')
          .eq('staff_relation_id', data.id)
          .is('end_time', null)
          .eq('status', 'active')
          .maybeSingle();
          
        if (sessionsError) throw sessionsError;
        
        setActiveWorkSession(activeSessions);
        
      } catch (error) {
        console.error("Error fetching staff relation:", error);
        toast({
          title: "Error",
          description: "Could not fetch your staff relationship",
          variant: "destructive"
        });
      }
    };
    
    getStaffRelation();
  }, [toast]);
  
  // Start/End work session
  const startWorkDay = async () => {
    try {
      const { data, error } = await supabase
        .from('staff_work_logs')
        .insert({
          staff_relation_id: staffRelationId,
          start_time: new Date().toISOString(),
          status: 'active'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setActiveWorkSession(data);
      
      toast({
        title: "Work day started",
        description: "Your work day has been started successfully",
      });
    } catch (error) {
      console.error("Error starting work day:", error);
      toast({
        title: "Error",
        description: "Could not start your work day",
        variant: "destructive"
      });
    }
  };
  
  const endWorkDay = async () => {
    if (!activeWorkSession) return;
    
    try {
      const { data, error } = await supabase
        .from('staff_work_logs')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed'
        })
        .eq('id', activeWorkSession.id)
        .select()
        .single();
        
      if (error) throw error;
      
      setActiveWorkSession(null);
      
      toast({
        title: "Work day ended",
        description: "Your work day has been ended successfully",
      });
    } catch (error) {
      console.error("Error ending work day:", error);
      toast({
        title: "Error",
        description: "Could not end your work day",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Job Cards</h1>
          <p className="text-muted-foreground">
            Record completed jobs and track your daily earnings
          </p>
        </div>
      </div>
      
      {staffRelationId ? (
        <>
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Work Status</h3>
                    <p className="text-sm text-muted-foreground">
                      {activeWorkSession 
                        ? `Currently working since ${new Date(activeWorkSession.start_time).toLocaleTimeString()}` 
                        : "Not currently working"}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 sm:ml-auto">
                  {activeWorkSession ? (
                    <>
                      <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="flex-1 sm:flex-auto"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Job Card
                      </Button>
                      <Button
                        variant="outline"
                        onClick={endWorkDay}
                        className="flex-1 sm:flex-auto"
                      >
                        End Work Day
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={startWorkDay}
                      className="w-full sm:w-auto"
                    >
                      Start Work Day
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="job-cards">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="job-cards">Job Cards</TabsTrigger>
              <TabsTrigger value="work-history">Work History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="job-cards" className="mt-6">
              <div className="mb-4 flex justify-end">
                <Button 
                  onClick={() => setIsCreateOpen(true)}
                  disabled={!activeWorkSession}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Job Card
                </Button>
              </div>
              <JobCardsList staffRelationId={staffRelationId} />
            </TabsContent>
            
            <TabsContent value="work-history" className="mt-6">
              <div className="space-y-6">
                <h3 className="font-medium text-lg">Work Session History</h3>
                {activeWorkSession && (
                  <Card className="bg-muted/50 mb-4">
                    <CardContent className="p-4">
                      <p className="font-medium">Active Session</p>
                      <p className="text-sm text-muted-foreground">
                        Started at {new Date(activeWorkSession.start_time).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                )}
                <WorkHistory staffRelationId={staffRelationId} />
              </div>
            </TabsContent>
          </Tabs>
          
          <CreateJobCardDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            staffRelationId={staffRelationId}
          />
        </>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium mb-2">Staff Account Required</h3>
            <p className="text-muted-foreground mb-4">
              You need to be registered as staff to access job cards.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Inline WorkHistory component
const WorkHistory = ({ staffRelationId }: { staffRelationId: string }) => {
  const [workSessions, setWorkSessions] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const fetchWorkSessions = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('staff_work_logs')
          .select('*')
          .eq('staff_relation_id', staffRelationId)
          .order('start_time', { ascending: false });
          
        if (error) throw error;
        
        // Transform the sessions to include a date field
        const formattedSessions = (data || []).map(session => ({
          ...session,
          date: new Date(session.start_time).toISOString().split('T')[0]
        }));
        
        setWorkSessions(formattedSessions);
      } catch (error) {
        console.error("Error fetching work sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkSessions();
  }, [staffRelationId]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (workSessions.length === 0) {
    return (
      <div className="text-center p-6 border rounded-lg border-dashed">
        <h3 className="text-lg font-medium mb-2">No work history</h3>
        <p className="text-muted-foreground">
          Your work history will appear here once you start recording work sessions
        </p>
      </div>
    );
  }
  
  return <StaffWorkSessionTable sessions={workSessions} />;
};

export default DashboardJobCards;
