import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, differenceInMinutes, isToday, isThisWeek, isThisMonth } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { formatDuration, formatDateTime } from "@/utils/formatUtils";
import { Clock, Calendar, Filter, Timer } from "lucide-react";

interface WorkHistoryProps {
  staffRelationId: string;
  limit?: number;
}

type FilterPeriod = "all" | "today" | "thisWeek" | "thisMonth";

const WorkHistory: React.FC<WorkHistoryProps> = ({ staffRelationId, limit }) => {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("all");
  
  const { data: workSessions, isLoading } = useQuery({
    queryKey: ['staffWorkSessions', staffRelationId],
    queryFn: async () => {
      let query = supabase
        .from('staff_work_logs')
        .select('*')
        .eq('staff_relation_id', staffRelationId)
        .eq('status', 'completed')
        .order('start_time', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
        
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });
  
  // Filter work sessions based on period
  const filteredSessions = workSessions?.filter(session => {
    if (filterPeriod === "all") return true;
    
    const date = parseISO(session.start_time);
    switch (filterPeriod) {
      case "today": return isToday(date);
      case "thisWeek": return isThisWeek(date);
      case "thisMonth": return isThisMonth(date);
      default: return true;
    }
  }) || [];
  
  // Calculate total work hours for the filtered period
  const getTotalWorkHours = () => {
    if (!filteredSessions.length) return "No data";
    
    const totalMinutes = filteredSessions.reduce((total, session) => {
      if (!session.end_time) return total;
      
      const start = new Date(session.start_time);
      const end = new Date(session.end_time);
      return total + differenceInMinutes(end, start);
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };
  
  // Group work sessions by date
  const sessionsByDate: Record<string, any[]> = {};
  filteredSessions.forEach(session => {
    const dateKey = format(new Date(session.start_time), "yyyy-MM-dd");
    if (!sessionsByDate[dateKey]) {
      sessionsByDate[dateKey] = [];
    }
    sessionsByDate[dateKey].push(session);
  });
  
  if (isLoading) {
    return <div className="text-center p-4">Loading work history...</div>;
  }
  
  if (!filteredSessions.length) {
    return (
      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Work History</CardTitle>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterPeriod} onValueChange={(value) => setFilterPeriod(value as FilterPeriod)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="thisWeek">This week</SelectItem>
                  <SelectItem value="thisMonth">This month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-center p-8">
          <p className="text-muted-foreground">No work history found for the selected period.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Work History</CardTitle>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterPeriod} onValueChange={(value) => setFilterPeriod(value as FilterPeriod)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="thisWeek">This week</SelectItem>
                <SelectItem value="thisMonth">This month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Sessions: {filteredSessions.length}</span>
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1">
            <Timer className="h-3 w-3" />
            <span>Total work time: {getTotalWorkHours()}</span>
          </Badge>
          
          {filterPeriod === "today" && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Today: {format(new Date(), "MMM d, yyyy")}</span>
            </Badge>
          )}
        </div>
        
        <div className="space-y-4">
          {Object.entries(sessionsByDate).map(([dateStr, sessions]) => (
            <div key={dateStr} className="mb-6">
              <div className="flex items-center justify-between bg-muted/30 p-2 rounded-md mb-2">
                <h3 className="font-medium">
                  {format(parseISO(dateStr), "EEEE, MMMM d, yyyy")}
                </h3>
                <Badge variant="outline">
                  {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
                </Badge>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map(session => {
                    // Calculate duration
                    let duration = "In progress";
                    if (session.end_time) {
                      const start = new Date(session.start_time);
                      const end = new Date(session.end_time);
                      duration = formatDuration(start, end);
                    }
                    
                    return (
                      <TableRow key={session.id}>
                        <TableCell>
                          {format(new Date(session.start_time), "h:mm a")}
                        </TableCell>
                        <TableCell>
                          {session.end_time ? format(new Date(session.end_time), "h:mm a") : "In progress"}
                        </TableCell>
                        <TableCell>{duration}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {session.notes || "No notes"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkHistory;
