
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StaffWorkSessionTable } from "@/components/staff/StaffWorkSessionTable";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface WorkHistoryProps {
  staffRelationId: string;
}

const WorkHistory: React.FC<WorkHistoryProps> = ({ staffRelationId }) => {
  const [workSessions, setWorkSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchWorkSessions = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('staff_work_logs')
          .select('*')
          .eq('staff_relation_id', staffRelationId)
          .order('start_time', { ascending: false });
          
        if (error) throw error;
        
        // Transform the sessions to include a date field and calculate earnings
        const formattedSessions = (data || []).map(session => {
          // Parse session date for display
          const sessionDate = new Date(session.start_time);
          
          return {
            ...session,
            date: sessionDate.toISOString().split('T')[0],
            earnings: session.earnings || 0
          };
        });
        
        setWorkSessions(formattedSessions);
      } catch (error) {
        console.error("Error fetching work sessions:", error);
        toast({
          title: "Error",
          description: "Could not fetch work history",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (staffRelationId) {
      fetchWorkSessions();
    }
  }, [staffRelationId, toast]);
  
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
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Work Session History</h3>
      <StaffWorkSessionTable sessions={workSessions} />
    </div>
  );
};

export default WorkHistory;
