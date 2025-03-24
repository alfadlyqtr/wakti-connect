
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, Filter } from "lucide-react";
import { format } from "date-fns";
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
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface StaffWorkSession {
  id: string;
  start_time: string;
  end_time?: string;
  status: string;
  earnings: number;
  staff_relation_id: string;
}

interface StaffWithSessions {
  id: string;
  name: string;
  sessions?: StaffWorkSession[];
}

const timeRanges = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Last 30 Days", value: "30days" },
  { label: "All Time", value: "all" }
];

const DashboardWorkLogs = () => {
  const [selectedStaff, setSelectedStaff] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [showCustomDateFilter, setShowCustomDateFilter] = useState(false);

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

  // Fetch all staff members and their work logs with filters
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['staffWorkLogs', timeRange, selectedStaff, customStartDate, customEndDate],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      // First, get all staff members for this business
      const { data: staffMembers, error: staffError } = await supabase
        .from('business_staff')
        .select('id, name, staff_id')
        .eq('business_id', session.session.user.id);
        
      if (staffError) throw staffError;
      
      // For each staff member, get their work logs with filters applied
      const staffWithLogs: StaffWithSessions[] = [];
      const { start, end } = getDateRange();
      
      for (const staff of staffMembers || []) {
        // Skip if filtering by staff and this isn't the selected one
        if (selectedStaff !== 'all' && staff.id !== selectedStaff) {
          continue;
        }
        
        let query = supabase
          .from('staff_work_logs')
          .select('*')
          .eq('staff_relation_id', staff.id)
          .order('start_time', { ascending: false });
        
        // Apply date range filters
        if (start) {
          query = query.gte('start_time', start.toISOString());
        }
        if (end) {
          query = query.lte('start_time', end.toISOString());
        }
        
        const { data: workLogs, error: logsError } = await query;
          
        if (logsError) {
          console.error(`Error fetching logs for staff ${staff.id}:`, logsError);
          continue;
        }
        
        // Only add staff with logs unless we're not filtering
        if (workLogs && workLogs.length > 0) {
          staffWithLogs.push({
            id: staff.id,
            name: staff.name,
            sessions: workLogs as StaffWorkSession[] || []
          });
        }
      }
      
      return staffWithLogs;
    }
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

  // Calculate total hours and earnings
  const calculateTotals = () => {
    let totalEarnings = 0;
    let totalHours = 0;
    let totalSessions = 0;
    
    data?.forEach(staff => {
      staff.sessions?.forEach(session => {
        totalEarnings += session.earnings || 0;
        totalSessions++;
        
        if (session.end_time) {
          const start = new Date(session.start_time);
          const end = new Date(session.end_time);
          const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          totalHours += diffHours;
        }
      });
    });
    
    return {
      totalEarnings: totalEarnings.toFixed(2),
      totalHours: totalHours.toFixed(1),
      totalSessions
    };
  };

  const { totalEarnings, totalHours, totalSessions } = calculateTotals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Staff Work Logs</h1>
        <p className="text-muted-foreground">Track staff hours, sessions, and earnings</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <Select 
            value={selectedStaff} 
            onValueChange={setSelectedStaff}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select staff member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff Members</SelectItem>
              {data?.map(staff => (
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
        
        <Button variant="outline" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      
      {/* Summary cards */}
      {data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{totalSessions}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">{totalHours}h</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">${totalEarnings}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {/* Main content */}
      {isLoading ? (
        <Card className="p-6 text-center">
          <div className="h-6 w-6 border-4 border-t-transparent border-primary rounded-full animate-spin mx-auto"></div>
          <p className="mt-2">Loading work logs...</p>
        </Card>
      ) : error ? (
        <Card className="p-6">
          <p className="text-destructive">Error loading work logs: {error instanceof Error ? error.message : "Unknown error"}</p>
          <Button className="mt-2" variant="secondary" onClick={() => refetch()}>Retry</Button>
        </Card>
      ) : !data || data.length === 0 ? (
        <Card className="p-6 text-center">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Work Logs Available</h3>
          <p className="text-muted-foreground">There are no staff work logs to display for the selected filters.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {data.map(staff => (
            <Card key={staff.id} className="overflow-hidden">
              <div className="bg-muted px-4 py-3 border-b">
                <h3 className="font-medium text-lg">{staff.name}</h3>
              </div>
              <div className="p-0">
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
                    {staff.sessions?.map(session => (
                      <TableRow key={session.id}>
                        <TableCell>
                          {format(new Date(session.start_time), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          {format(new Date(session.start_time), 'hh:mm a')}
                        </TableCell>
                        <TableCell>
                          {session.end_time 
                            ? format(new Date(session.end_time), 'hh:mm a')
                            : "In progress"}
                        </TableCell>
                        <TableCell>
                          {formatDuration(session.start_time, session.end_time)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={session.status === "active" ? "outline" : "secondary"}>
                            {session.status === "active" ? "Active" : "Completed"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {session.earnings > 0 
                            ? `$${session.earnings.toFixed(2)}`
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardWorkLogs;
