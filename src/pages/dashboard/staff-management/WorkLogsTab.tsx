
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign } from "lucide-react";
import { WorkLog } from "./types";

interface WorkLogsTabProps {
  selectedStaffId: string | null;
}

const WorkLogsTab: React.FC<WorkLogsTabProps> = ({ selectedStaffId }) => {
  // Fetch work logs for selected staff
  const { data: workLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['staffWorkLogs', selectedStaffId],
    queryFn: async () => {
      if (!selectedStaffId) return [];
      
      const { data, error } = await supabase
        .from('staff_work_logs')
        .select('*')
        .eq('staff_relation_id', selectedStaffId)
        .order('start_time', { ascending: false });
        
      if (error) throw error;
      return data as WorkLog[];
    },
    enabled: !!selectedStaffId
  });

  if (!selectedStaffId) {
    return (
      <div className="text-center py-8">
        <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Select a Staff Member</h3>
        <p className="text-muted-foreground">Select a staff member to view their work logs</p>
      </div>
    );
  }

  if (logsLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!workLogs || workLogs.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Work Logs</h3>
        <p className="text-muted-foreground">This staff member has no work logs yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workLogs.map((log) => (
        <div key={log.id} className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">
                {new Date(log.start_time).toLocaleDateString()}
              </span>
            </div>
            <Badge variant={log.end_time ? "outline" : "secondary"}>
              {log.end_time ? "Completed" : "In Progress"}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Start Time</p>
              <p>{new Date(log.start_time).toLocaleTimeString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">End Time</p>
              <p>{log.end_time ? new Date(log.end_time).toLocaleTimeString() : "Not ended"}</p>
            </div>
            {log.earnings !== null && (
              <div className="col-span-2 flex items-center mt-2">
                <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Earnings: ${log.earnings.toFixed(2)}</span>
              </div>
            )}
            {log.notes && (
              <div className="col-span-2 mt-2">
                <p className="text-muted-foreground">Notes</p>
                <p>{log.notes}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkLogsTab;
