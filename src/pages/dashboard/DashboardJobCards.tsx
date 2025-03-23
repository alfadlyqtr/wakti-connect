
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import CreateJobCardDialog from "@/components/jobs/CreateJobCardDialog";
import JobCardsList from "@/components/jobs/JobCardsList";
import WorkStatusCard from "@/components/staff/WorkStatusCard";
import WorkHistory from "@/components/staff/WorkHistory";
import ActiveWorkSession from "@/components/staff/ActiveWorkSession";

const DashboardJobCards = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [staffRelationId, setStaffRelationId] = useState<string | null>(null);
  const [activeWorkSession, setActiveWorkSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch staff relation ID for the current user
  useEffect(() => {
    const getStaffRelation = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('business_staff')
          .select('id')
          .eq('staff_id', user.id)
          .eq('status', 'active')
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching staff relation:", error);
          setIsLoading(false);
          return;
        }
        
        if (data) {
          setStaffRelationId(data.id);
          // Also check for active work session
          await fetchActiveWorkSession(data.id);
        }
        
      } catch (error) {
        console.error("Error fetching staff relation:", error);
        toast({
          title: "Error",
          description: "Could not fetch your staff relationship",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    getStaffRelation();
  }, [toast]);
  
  const fetchActiveWorkSession = async (relationId: string) => {
    try {
      const { data: activeSessions, error: sessionsError } = await supabase
        .from('staff_work_logs')
        .select('*')
        .eq('staff_relation_id', relationId)
        .is('end_time', null)
        .eq('status', 'active')
        .maybeSingle();
        
      if (sessionsError) {
        console.error("Error fetching active work session:", sessionsError);
        return;
      }
      
      setActiveWorkSession(activeSessions);
    } catch (error) {
      console.error("Error fetching active work session:", error);
    }
  };
  
  // Start/End work session
  const startWorkDay = async () => {
    if (!staffRelationId) {
      toast({
        title: "Error",
        description: "Staff relationship not found",
        variant: "destructive"
      });
      return;
    }
    
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
        
      if (error) {
        console.error("Error starting work day:", error);
        throw error;
      }
      
      setActiveWorkSession(data);
      
      toast({
        title: "Work day started",
        description: "Your work day has been started successfully",
      });
    } catch (error) {
      console.error("Error starting work day:", error);
      toast({
        title: "Error",
        description: "Could not start your work day. " + (error instanceof Error ? error.message : ""),
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
        
      if (error) {
        console.error("Error ending work day:", error);
        throw error;
      }
      
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
  
  if (isLoading) {
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
        
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
          <span className="ml-2">Loading job cards...</span>
        </div>
      </div>
    );
  }
  
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
          <WorkStatusCard 
            activeWorkSession={activeWorkSession}
            onStartWorkDay={startWorkDay}
            onEndWorkDay={endWorkDay}
            onCreateJobCard={() => setIsCreateOpen(true)}
          />
          
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
                <ActiveWorkSession session={activeWorkSession} />
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

export default DashboardJobCards;
