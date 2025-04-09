
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, differenceInSeconds } from "date-fns";

interface WorkHistorySectionProps {
  staffRelationId: string;
  activeWorkSession?: any;
}

const WorkHistorySection: React.FC<WorkHistorySectionProps> = ({ staffRelationId, activeWorkSession }) => {
  const [workSessions, setWorkSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchWorkHistory = async () => {
      if (!staffRelationId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('staff_work_logs')
          .select('*')
          .eq('staff_relation_id', staffRelationId)
          .order('start_time', { ascending: false })
          .limit(5);  // Show last 5 sessions
          
        if (error) throw error;
        
        setWorkSessions(data || []);
      } catch (err) {
        console.error("Error fetching work history:", err);
        setError(err instanceof Error ? err : new Error('Failed to load work history'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkHistory();
    
    // Set up polling for work history updates
    const interval = setInterval(fetchWorkHistory, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [staffRelationId, activeWorkSession]);
  
  const formatDateTime = (dateTimeStr: string) => {
    try {
      return format(new Date(dateTimeStr), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  const formatDuration = (startTimeStr: string, endTimeStr: string | null) => {
    try {
      const startTime = new Date(startTimeStr);
      const endTime = endTimeStr ? new Date(endTimeStr) : new Date();
      
      const diffSeconds = differenceInSeconds(endTime, startTime);
      
      // Convert to HH:MM:SS format
      const hours = Math.floor(diffSeconds / 3600);
      const minutes = Math.floor((diffSeconds % 3600) / 60);
      const seconds = diffSeconds % 60;
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } catch (e) {
      return '00:00:00';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Work Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center">
            <div className="h-8 w-8 mx-auto mb-2 border-4 border-t-transparent border-blue-400 rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading work history...</p>
          </div>
        ) : error ? (
          <div className="py-4 text-center text-red-500">{error.message}</div>
        ) : workSessions.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            No work sessions found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{formatDateTime(session.start_time)}</TableCell>
                  <TableCell>{formatDuration(session.start_time, session.end_time)}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${
                        session.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : session.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {session.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkHistorySection;
