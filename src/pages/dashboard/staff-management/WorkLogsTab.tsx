
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Filter } from "lucide-react";
import { WorkLog } from "./types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface WorkLogsTabProps {
  selectedStaffId: string | null;
}

const timeRanges = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Last 30 Days", value: "30days" },
  { label: "All Time", value: "all" }
];

const WorkLogsTab: React.FC<WorkLogsTabProps> = ({ selectedStaffId }) => {
  const [selectedStaff, setSelectedStaff] = useState<string | null>(selectedStaffId);
  const [timeRange, setTimeRange] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [showCustomDateFilter, setShowCustomDateFilter] = useState(false);

  // Fetch all staff members
  const { data: staffMembers, isLoading: staffLoading } = useQuery({
    queryKey: ['staffMembers'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('business_staff')
        .select('id, name')
        .eq('business_id', session.session.user.id)
        .order('name');
        
      if (error) throw error;
      return data;
    }
  });

  // Calculate date range based on filter
  const getDateRange = () => {
    const now = new Date();
    let startDate: Date | null = null;
    
    switch (timeRange) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case '30days':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        break;
      case 'custom':
        return { 
          start: customStartDate ? new Date(customStartDate) : null,
          end: customEndDate ? new Date(customEndDate) : null
        };
      default:
        return { start: null, end: null }; // All time
    }
    
    return { start: startDate, end: null };
  };

  // Fetch work logs with filters
  const { data: workLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['staffWorkLogs', selectedStaff, timeRange, customStartDate, customEndDate],
    queryFn: async () => {
      if (!selectedStaff) return [];
      
      let query = supabase
        .from('staff_work_logs')
        .select('*')
        .order('start_time', { ascending: false });
      
      // Apply staff filter
      query = query.eq('staff_relation_id', selectedStaff);
      
      // Apply date range filter
      const { start, end } = getDateRange();
      if (start) {
        query = query.gte('start_time', start.toISOString());
      }
      if (end) {
        query = query.lte('start_time', end.toISOString());
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as WorkLog[];
    },
    enabled: !!selectedStaff
  });

  // Function to format duration between start and end times
  const formatDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return "In progress";
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };

  // Calculate total duration in milliseconds
  const calculateTotalDuration = (logs: WorkLog[]): number => {
    return logs.reduce((total, log) => {
      if (!log.end_time) return total; // Skip active sessions
      
      const start = new Date(log.start_time);
      const end = new Date(log.end_time);
      return total + (end.getTime() - start.getTime());
    }, 0);
  };

  // Format milliseconds to human-readable duration
  const formatTotalDuration = (ms: number): string => {
    const totalHours = Math.floor(ms / (1000 * 60 * 60));
    const totalMinutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${totalHours}h ${totalMinutes}m`;
  };

  // Calculate total earnings
  const calculateTotalEarnings = (logs: WorkLog[]): number => {
    return logs.reduce((total, log) => {
      return total + (log.earnings || 0);
    }, 0);
  };

  // Count completed sessions
  const countCompletedSessions = (logs: WorkLog[]): number => {
    return logs.filter(log => log.end_time).length;
  };

  // Count active sessions
  const countActiveSessions = (logs: WorkLog[]): number => {
    return logs.filter(log => !log.end_time).length;
  };

  if (staffLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <Select 
            value={selectedStaff || ""} 
            onValueChange={setSelectedStaff}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select staff member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder" disabled>Select staff member</SelectItem>
              {staffMembers?.map(staff => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={timeRange} 
            onValueChange={(value) => {
              setTimeRange(value);
              if (value === 'custom') {
                setShowCustomDateFilter(true);
              }
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          {timeRange === 'custom' && (
            <Popover open={showCustomDateFilter} onOpenChange={setShowCustomDateFilter}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Custom Range
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Custom Date Range</h4>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-2">
                      <label htmlFor="start-date">Start Date</label>
                      <Input
                        id="start-date"
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="col-span-2"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-2">
                      <label htmlFor="end-date">End Date</label>
                      <Input
                        id="end-date"
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="col-span-2"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setShowCustomDateFilter(false)}
                      size="sm"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {!selectedStaff ? (
        <div className="text-center py-8">
          <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Select a Staff Member</h3>
          <p className="text-muted-foreground">Select a staff member to view their work logs</p>
        </div>
      ) : logsLoading ? (
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
        </div>
      ) : !workLogs || workLogs.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Work Logs</h3>
          <p className="text-muted-foreground">No work logs found for the selected period</p>
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Work Logs</CardTitle>
            <CardDescription>
              Showing {workLogs.length} work {workLogs.length === 1 ? 'session' : 'sessions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.start_time), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(log.start_time), 'hh:mm a')}
                    </TableCell>
                    <TableCell>
                      {log.end_time 
                        ? format(new Date(log.end_time), 'hh:mm a')
                        : "In progress"}
                    </TableCell>
                    <TableCell>
                      {formatDuration(log.start_time, log.end_time)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={!log.end_time ? "outline" : "secondary"}>
                        {!log.end_time ? "Active" : "Completed"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.earnings > 0 
                        ? `$${log.earnings.toFixed(2)}`
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="bg-muted/20">
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">Summary Totals:</TableCell>
                  <TableCell className="font-medium">{formatTotalDuration(calculateTotalDuration(workLogs))}</TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {countCompletedSessions(workLogs)} completed, 
                      {countActiveSessions(workLogs) > 0 ? ` ${countActiveSessions(workLogs)} active` : ' 0 active'}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">${calculateTotalEarnings(workLogs).toFixed(2)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between border-t pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Total Time: <span className="font-medium">{formatTotalDuration(calculateTotalDuration(workLogs))}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Sessions: <span className="font-medium">{workLogs.length} total</span> 
                <span className="text-muted-foreground"> ({countCompletedSessions(workLogs)} completed)</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Total Earnings: <span className="font-medium">${calculateTotalEarnings(workLogs).toFixed(2)}</span>
              </span>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default WorkLogsTab;
