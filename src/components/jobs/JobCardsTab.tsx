
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getStaffPermissions } from "@/services/staff/staffPermissionService";

import CreateJobCardDialog from "@/components/jobs/CreateJobCardDialog";
import JobCardsList from "@/components/jobs/JobCardsList";
import WorkStatusCard from "@/components/staff/WorkStatusCard";
import WorkHistory from "@/components/staff/WorkHistory";
import ActiveWorkSession from "@/components/staff/ActiveWorkSession";
import { FileX, Lock } from "lucide-react";

const JobCardsTab = () => {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [staffRelationId, setStaffRelationId] = useState<string | null>(null);
  const [activeWorkSession, setActiveWorkSession] = useState<any | null>(null);
  const [canCreateJobCards, setCanCreateJobCards] = useState(false);
  const [canTrackHours, setCanTrackHours] = useState(false);
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  
  // Fetch staff relation ID and permissions for the current user
  useEffect(() => {
    const getStaffRelation = async () => {
      try {
        setPermissionsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setPermissionsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('business_staff')
          .select('id, permissions')
          .eq('staff_id', user.id)
          .single();
          
        if (error) {
          setPermissionsLoading(false);
          throw error;
        }
        
        if (!data) {
          setPermissionsLoading(false);
          return;
        }
        
        setStaffRelationId(data.id);
        
        // Set permissions from data
        if (data.permissions) {
          setCanCreateJobCards(!!data.permissions.can_create_job_cards);
          setCanTrackHours(!!data.permissions.can_track_hours);
        } else {
          // Default permissions if not set
          setCanCreateJobCards(true);
          setCanTrackHours(true);
        }
        
        // Also check for active work session
        if ((data.permissions?.can_track_hours !== false)) {
          const { data: activeSessions, error: sessionsError } = await supabase
            .from('staff_work_logs')
            .select('*')
            .eq('staff_relation_id', data.id)
            .is('end_time', null)
            .eq('status', 'active')
            .maybeSingle();
            
          if (sessionsError) throw sessionsError;
          
          setActiveWorkSession(activeSessions);
        }
        
        setPermissionsLoading(false);
      } catch (error) {
        console.error("Error fetching staff relation:", error);
        setPermissionsLoading(false);
        toast({
          title: "Error",
          description: "Could not fetch your staff information",
          variant: "destructive"
        });
      }
    };
    
    getStaffRelation();
  }, [toast]);
  
  // Start/End work session
  const startWorkDay = async () => {
    if (!canTrackHours) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to track work hours",
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
  
  const openCreateJobCard = () => {
    if (!canCreateJobCards) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to create job cards",
        variant: "destructive"
      });
      return;
    }
    
    if (!activeWorkSession) {
      toast({
        title: "Work Day Required",
        description: "You need to start your work day before creating job cards",
      });
      return;
    }
    
    setIsCreateOpen(true);
  };
  
  return (
    <>
      {permissionsLoading ? (
        <Card>
          <CardContent className="p-8 flex justify-center">
            <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
          </CardContent>
        </Card>
      ) : staffRelationId ? (
        <>
          <WorkStatusCard 
            activeWorkSession={activeWorkSession}
            onStartWorkDay={startWorkDay}
            onEndWorkDay={endWorkDay}
            onCreateJobCard={openCreateJobCard}
          />
          
          <div className="mt-6">
            <div className="space-y-6">
              {canCreateJobCards ? (
                <JobCardsList staffRelationId={staffRelationId} />
              ) : (
                <Card>
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Access to Job Cards</h3>
                    <p className="text-muted-foreground max-w-md">
                      You don't have permission to view or create job cards. Contact your business admin to request access.
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {canTrackHours && (
                <div className="pt-6 border-t">
                  <h3 className="font-medium text-lg mb-4">Work Session History</h3>
                  <ActiveWorkSession session={activeWorkSession} />
                  <div className="mt-4">
                    <WorkHistory staffRelationId={staffRelationId} />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {canCreateJobCards && (
            <CreateJobCardDialog
              open={isCreateOpen}
              onOpenChange={setIsCreateOpen}
              staffRelationId={staffRelationId}
            />
          )}
          
          {/* Hidden button for parent component to access */}
          <button
            id="create-job-card-button"
            className="hidden"
            onClick={openCreateJobCard}
            disabled={!activeWorkSession || !canCreateJobCards}
          />
        </>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <FileX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
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
