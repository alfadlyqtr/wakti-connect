
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, FileText } from "lucide-react";

interface WorkSession {
  id: string;
  start_time: string;
  end_time: string | null;
  earnings: number | null;
  notes: string | null;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  job_cards_count?: number;
}

interface WorkHistoryProps {
  staffRelationId: string;
}

const WorkHistory: React.FC<WorkHistoryProps> = ({ staffRelationId }) => {
  const { data: workSessions, isLoading } = useQuery({
    queryKey: ['staffWorkHistory', staffRelationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_work_logs')
        .select('*, job_cards(count)')
        .eq('staff_relation_id', staffRelationId)
        .not('id', 'eq', null)
        .order('start_time', { ascending: false });
        
      if (error) throw error;
      
      // Correctly process the job_cards count from Supabase
      return data.map(session => ({
        ...session,
        job_cards_count: session.job_cards?.[0]?.count || 0
      })) as WorkSession[];
    }
  });
  
  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!workSessions || workSessions.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed rounded-md">
        <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Work History</h3>
        <p className="text-muted-foreground">No work sessions found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {workSessions.map(session => (
        <div key={session.id} className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">
              {format(new Date(session.start_time), "PPP")}
            </h4>
            <Badge variant={
              session.status === 'active' ? "secondary" : 
              session.status === 'completed' ? "outline" : 
              "destructive"
            }>
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Start Time</p>
              <p>{format(new Date(session.start_time), "h:mm a")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">End Time</p>
              <p>
                {session.end_time 
                  ? format(new Date(session.end_time), "h:mm a")
                  : "Not ended"}
              </p>
            </div>
            
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>
                {session.earnings 
                  ? `$${session.earnings.toFixed(2)}` 
                  : "$0.00"} earned
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>{session.job_cards_count || 0} job cards</span>
            </div>
            
            {session.notes && (
              <div className="col-span-2 mt-2">
                <p className="text-muted-foreground">Notes</p>
                <p>{session.notes}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkHistory;
