
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { fetchWorkHistory } from '@/services/jobs/workHistoryApi';
import { format } from 'date-fns';
import { formatDuration, formatDateTime } from '@/utils/formatUtils';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface WorkHistoryProps {
  staffRelationId: string;
  activeWorkSession: any | null;
}

const WorkHistory: React.FC<WorkHistoryProps> = ({ 
  staffRelationId,
  activeWorkSession
}) => {
  const { data: workLogs = [], isLoading, error } = useQuery({
    queryKey: ['workHistory', staffRelationId],
    queryFn: () => fetchWorkHistory(staffRelationId)
  });
  
  // Group sessions by date
  const sessionsByDate: Record<string, any[]> = {};
  
  if (workLogs && workLogs.length > 0) {
    workLogs.forEach(log => {
      // Skip active sessions that we're displaying separately
      if (activeWorkSession && log.id === activeWorkSession.id) {
        return;
      }
      
      if (log.start_time) {
        const dateStr = format(new Date(log.start_time), 'yyyy-MM-dd');
        if (!sessionsByDate[dateStr]) {
          sessionsByDate[dateStr] = [];
        }
        sessionsByDate[dateStr].push(log);
      }
    });
  }
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Loading work history...</span>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium text-destructive">
            Error loading work history: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (Object.keys(sessionsByDate).length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No work history found.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(sessionsByDate).map(([dateStr, logs]) => (
              <React.Fragment key={dateStr}>
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={4}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {format(new Date(dateStr), "EEEE, MMMM d, yyyy")}
                      </span>
                      <Badge variant="outline">
                        {logs.length} session{logs.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
                {logs.map(log => {
                  // Calculate duration
                  let duration = "In progress";
                  if (log.start_time && log.end_time) {
                    const start = new Date(log.start_time);
                    const end = new Date(log.end_time);
                    duration = formatDuration(start, end);
                  }
                  
                  return (
                    <TableRow key={log.id}>
                      <TableCell>{log.start_time ? formatDateTime(log.start_time) : "—"}</TableCell>
                      <TableCell>
                        {log.end_time ? formatDateTime(log.end_time) : 'In progress'}
                      </TableCell>
                      <TableCell>{duration}</TableCell>
                      <TableCell>
                        <Badge variant={log.status === 'completed' ? 'success' : 'warning'}>
                          {log.status === 'completed' ? 'Completed' : 'Active'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WorkHistory;
