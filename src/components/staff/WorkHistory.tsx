
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/utils/dateUtils";
import { Loader2, Clock } from "lucide-react";

interface WorkHistoryProps {
  staffRelationId: string;
  limit?: number;
}

const WorkHistory: React.FC<WorkHistoryProps> = ({ staffRelationId, limit }) => {
  const [page, setPage] = useState(1);
  const pageSize = limit || 10;
  
  const { data: workLogs, isLoading, error } = useQuery({
    queryKey: ['staffWorkHistory', staffRelationId, page, pageSize],
    queryFn: async () => {
      if (!staffRelationId) {
        return { logs: [], count: 0 };
      }
      
      try {
        // Count total logs
        const { count, error: countError } = await supabase
          .from('staff_work_logs')
          .select('*', { count: 'exact', head: true })
          .eq('staff_relation_id', staffRelationId);
          
        if (countError) throw countError;
        
        // Get paginated logs
        const { data: logs, error: logsError } = await supabase
          .from('staff_work_logs')
          .select('*')
          .eq('staff_relation_id', staffRelationId)
          .order('start_time', { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1);
          
        if (logsError) throw logsError;
        
        return { logs, count: count || 0 };
      } catch (error) {
        console.error("Error fetching work logs:", error);
        throw error;
      }
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
        <span className="ml-2">Loading work history...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-destructive">Error loading work history</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!workLogs?.logs || workLogs.logs.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground">No work history found</p>
        </CardContent>
      </Card>
    );
  }
  
  const totalPages = Math.ceil((workLogs.count || 0) / pageSize);
  
  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {workLogs.logs.map((log: any) => (
          <Card key={log.id} className="bg-card">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <p className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    Start
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(log.start_time)} at {formatTime(log.start_time)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">End</p>
                  <p className="text-sm text-muted-foreground">
                    {log.end_time ? `${formatDate(log.end_time)} at ${formatTime(log.end_time)}` : 'Active'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <div className={`text-sm inline-flex items-center px-2 py-1 rounded-full ${
                    log.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    log.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {log.status}
                  </div>
                </div>
                
                {log.earnings > 0 && (
                  <div>
                    <p className="text-sm font-medium">Earnings</p>
                    <p className="text-sm text-muted-foreground">${log.earnings}</p>
                  </div>
                )}
                
                {log.notes && (
                  <div className="sm:col-span-2">
                    <p className="text-sm font-medium">Notes</p>
                    <p className="text-sm text-muted-foreground">{log.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {!limit && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-3">
            Page {page} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkHistory;
