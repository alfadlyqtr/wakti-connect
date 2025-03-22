
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  
  // Fetch staff relation ID for the current user
  useEffect(() => {
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
