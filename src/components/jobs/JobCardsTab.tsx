
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

import CreateJobCardDialog from "@/components/jobs/CreateJobCardDialog";
import JobCardsList from "@/components/jobs/JobCardsList";
import WorkStatusCard from "@/components/staff/WorkStatusCard";
import WorkHistory from "@/components/staff/WorkHistory";
import ActiveWorkSession from "@/components/staff/ActiveWorkSession";

const JobCardsTab = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [staffRelationId, setStaffRelationId] = useState<string | null>(null);
  const [activeWorkSession, setActiveWorkSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch staff relation ID for the current user
  useEffect(() => {
    const getStaffRelation = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          setError("No authenticated user found");
          return;
        }
        
        console.log("Fetching staff relation for user:", user.id);
        
        const { data, error } = await supabase
          .from('business_staff')
          .select('id')
          .eq('staff_id', user.id)
          .eq('status', 'active')
          .single();
          
        if (error) {
          console.error("Error fetching staff relation:", error);
          if (error.code === 'PGRST116') {
            setError("No staff relationship found. You might not be registered as staff.");
          } else {
            setError(`Could not fetch your staff relationship: ${error.message}`);
          }
          setIsLoading(false);
          return;
        }
        
        console.log("Found staff relation:", data.id);
        setStaffRelationId(data.id);
        
        // Also check for active work session
        await fetchActiveWorkSession(data.id);
        
      } catch (error: any) {
        console.error("Error fetching staff relation:", error);
        setError(`Could not fetch your staff relationship: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    getStaffRelation();
  }, [toast]);
  
  const fetchActiveWorkSession = async (relationId: string) => {
    try {
      console.log("Fetching active work session for staff relation:", relationId);
      
      const { data: activeSessions, error: sessionsError } = await supabase
        .from('staff_work_logs')
        .select('*')
        .eq('staff_relation_id', relationId)
        .is('end_time', null)
        .eq('status', 'active')
        .maybeSingle();
        
      if (sessionsError) {
        console.error("Error fetching active work session:", sessionsError);
        setError(`Could not fetch active work session: ${sessionsError.message}`);
        return;
      }
      
      console.log("Active work session:", activeSessions);
      setActiveWorkSession(activeSessions);
    } catch (error: any) {
      console.error("Error fetching active work session:", error);
      setError(`Could not fetch active work session: ${error.message}`);
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
        toast({
          title: "Error",
          description: `Could not start your work day: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      console.log("Work day started:", data);
      setActiveWorkSession(data);
      
      toast({
        title: "Work day started",
        description: "Your work day has been started successfully",
      });
    } catch (error: any) {
      console.error("Error starting work day:", error);
      toast({
        title: "Error",
        description: `Could not start your work day: ${error.message}`,
        variant: "destructive"
      });
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
        toast({
          title: "Error",
          description: `Could not end your work day: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      console.log("Work day ended:", data);
      setActiveWorkSession(null);
      
      toast({
        title: "Work day ended",
        description: "Your work day has been ended successfully",
      });
    } catch (error: any) {
      console.error("Error ending work day:", error);
      toast({
        title: "Error",
        description: `Could not end your work day: ${error.message}`,
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
        <span className="ml-2">Loading job cards...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-destructive">Error</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      {staffRelationId ? (
        <>
          <WorkStatusCard 
            activeWorkSession={activeWorkSession}
            onStartWorkDay={startWorkDay}
            onEndWorkDay={endWorkDay}
            onCreateJobCard={() => setIsCreateOpen(true)}
          />
          
          <div className="mt-6">
            <div className="space-y-6">
              <JobCardsList staffRelationId={staffRelationId} />
              
              <div className="pt-6 border-t">
                <h3 className="font-medium text-lg mb-4">Work Session History</h3>
                <ActiveWorkSession session={activeWorkSession} />
                <div className="mt-4">
                  <WorkHistory staffRelationId={staffRelationId} />
                </div>
              </div>
            </div>
          </div>
          
          <CreateJobCardDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            staffRelationId={staffRelationId}
          />
          
          {/* Hidden button for parent component to access */}
          <button
            id="create-job-card-button"
            className="hidden"
            onClick={() => setIsCreateOpen(true)}
            disabled={!activeWorkSession}
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
    </>
  );
};

export default JobCardsTab;
