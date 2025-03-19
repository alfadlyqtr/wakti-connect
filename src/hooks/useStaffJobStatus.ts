
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getStaffRelationPermissions } from "@/services/staff/staffPermissionService";

export interface StaffJobStatus {
  staffRelationId: string | null;
  activeWorkSession: any | null;
  canCreateJobCards: boolean;
  canTrackHours: boolean;
  permissionsLoading: boolean;
}

export function useStaffJobStatus() {
  const { toast } = useToast();
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
        
        // First, get the staff relation ID
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .select('id')
          .eq('staff_id', user.id)
          .maybeSingle();
          
        if (staffError) {
          console.error("Error fetching staff relation:", staffError);
          setPermissionsLoading(false);
          return;
        }
        
        if (!staffData) {
          setPermissionsLoading(false);
          return;
        }
        
        setStaffRelationId(staffData.id);
        
        // Now fetch permissions separately to avoid potential circular references
        const permissions = await getStaffRelationPermissions(staffData.id);
        setCanCreateJobCards(permissions.can_create_job_cards);
        setCanTrackHours(permissions.can_track_hours);
        
        // Check for active work session if allowed to track hours
        if (permissions.can_track_hours) {
          const { data: activeSessions, error: sessionsError } = await supabase
            .from('staff_work_logs')
            .select('*')
            .eq('staff_relation_id', staffData.id)
            .is('end_time', null)
            .eq('status', 'active')
            .maybeSingle();
            
          if (sessionsError) {
            console.error("Error fetching active work session:", sessionsError);
          } else {
            setActiveWorkSession(activeSessions);
          }
        }
        
        setPermissionsLoading(false);
      } catch (error) {
        console.error("Error in getStaffRelation:", error);
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
  
  // Start work session
  const startWorkDay = async () => {
    if (!canTrackHours) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to track work hours",
        variant: "destructive"
      });
      return;
    }
    
    if (!staffRelationId) {
      toast({
        title: "Error",
        description: "Staff relation ID not found",
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
        toast({
          title: "Error",
          description: "Could not start your work day: " + error.message,
          variant: "destructive"
        });
        return;
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
        description: "Could not start your work day",
        variant: "destructive"
      });
    }
  };
  
  // End work session
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
        toast({
          title: "Error",
          description: "Could not end your work day: " + error.message,
          variant: "destructive"
        });
        return;
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

  return {
    staffRelationId,
    activeWorkSession,
    canCreateJobCards,
    canTrackHours,
    permissionsLoading,
    startWorkDay,
    endWorkDay,
  };
}
