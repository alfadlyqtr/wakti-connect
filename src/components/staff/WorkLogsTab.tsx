
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText,
  UserClock,
  Filter,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parseISO, subDays, startOfToday } from "date-fns";

interface StaffWorkLog {
  id: string;
  staff_relation_id: string;
  start_time: string;
  end_time: string | null;
  earnings: number | null;
  notes: string | null;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

interface StaffMember {
  id: string;
  name: string;
  email: string | null;
  role: string;
  staff_number: string;
  position: string;
  is_service_provider: boolean;
  status: string;
  profile_image_url: string | null;
  sessions: StaffWorkLog[];
}

const WorkLogsTab = () => {
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<string>("all");

  // Fetch staff with their work sessions
  const { data: staffData, isLoading } = useQuery({
    queryKey: ['staffWithWorkLogs'],
    queryFn: async () => {
      // First fetch all staff members
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .select('*')
        .order('name');
        
      if (staffError) throw staffError;
      
      // For each staff, get their work logs
      const enrichedStaff = await Promise.all(
        staffData.map(async (staff) => {
          const { data: logData, error: logError } = await supabase
            .from('staff_work_logs')
            .select('*')
            .eq('staff_relation_id', staff.id)
            .order('start_time', { ascending: false });
            
          if (logError) {
            console.error(`Error fetching logs for staff ${staff.id}:`, logError);
            return {
              ...staff,
              sessions: []
            };
          }
          
          return {
            ...staff,
            sessions: logData || []
          };
        })
      );
      
      return enrichedStaff as StaffMember[];
    }
  });
  
  // Filter logs based on selected time period
  const getFilteredLogs = (sessions: StaffWorkLog[]) => {
    if (!sessions || sessions.length === 0) return [];
    if (timeFilter === "all") return sessions;
    
    const today = startOfToday();
    const filterDate = timeFilter === "today" 
      ? today 
      : timeFilter === "week" 
        ? subDays(today, 7) 
        : subDays(today, 30);
    
    return sessions.filter(session => 
      new Date(session.start_time) >= filterDate
    );
  };
  
  // Get selected staff data
  const selectedStaff = selectedStaffId 
    ? staffData?.find(staff => staff.id === selectedStaffId) 
    : staffData?.[0];
  
  const filteredLogs = selectedStaff 
    ? getFilteredLogs(selectedStaff.sessions)
    : [];
  
  // Calculate total hours for filtered logs
  const calculateTotalHours = (logs: StaffWorkLog[]) => {
    return logs.reduce((total, log) => {
      if (!log.end_time) return total;
      
      const startTime = new Date(log.start_time).getTime();
      const endTime = new Date(log.end_time).getTime();
      const diffHours = (endTime - startTime) / (1000 * 60 * 60);
      
      return total + diffHours;
    }, 0);
  };
  
  const totalHours = calculateTotalHours(filteredLogs);
  
  // Calculate total earnings for filtered logs
  const totalEarnings = filteredLogs.reduce((total, log) => {
    return total + (log.earnings || 0);
  }, 0);
  
  // Calculate active and completed sessions count
  const activeSessions = filteredLogs.filter(log => log.status === 'active').length;
  const completedSessions = filteredLogs.filter(log => log.status === 'completed').length;
  
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold">Staff Work Logs</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <Select
            value={selectedStaffId || staffData?.[0]?.id || ""}
            onValueChange={setSelectedStaffId}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select staff member" />
            </SelectTrigger>
            <SelectContent>
              {staffData?.map(staff => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                {timeFilter === "all" ? "All Time" : 
                 timeFilter === "today" ? "Today" : 
                 timeFilter === "week" ? "Last 7 Days" : "Last 30 Days"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter Time Period</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTimeFilter("all")}>
                All Time
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter("today")}>
                Today
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter("week")}>
                Last 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeFilter("month")}>
                Last 30 Days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {isLoading ? (
        <Card className="w-full flex justify-center p-8">
          <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
        </Card>
      ) : !staffData || staffData.length === 0 ? (
        <Card className="w-full p-8">
          <div className="text-center">
            <UserClock className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Staff Members</h3>
            <p className="text-muted-foreground">Add staff members to track their work hours</p>
          </div>
        </Card>
      ) : !selectedStaff ? (
        <Card className="w-full p-8">
          <div className="text-center">
            <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select a Staff Member</h3>
            <p className="text-muted-foreground">Please select a staff member to view their work logs</p>
          </div>
        </Card>
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
            <Card className="w-full md:w-1/3">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedStaff.profile_image_url || ""} alt={selectedStaff.name} />
                    <AvatarFallback>
                      {selectedStaff.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedStaff.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{selectedStaff.position}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant={selectedStaff.role === "co-admin" ? "secondary" : "outline"}>
                        {selectedStaff.role}
                      </Badge>
                      {selectedStaff.is_service_provider && (
                        <Badge variant="outline" className="border-wakti-blue text-wakti-blue">
                          Service Provider
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="pt-4">
                  <p className="text-sm font-medium">Staff ID: {selectedStaff.staff_number}</p>
                  {selectedStaff.email && (
                    <p className="text-sm text-muted-foreground mt-1">{selectedStaff.email}</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-2/3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-wakti-blue" />
                    Total Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{totalHours.toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">
                    From {filteredLogs.length} work sessions
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                    Total Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    Recorded from job cards
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-purple-500" />
                    Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{completedSessions}</p>
                  <p className="text-sm text-muted-foreground">
                    {activeSessions > 0 && `${activeSessions} active, `}
                    {completedSessions} completed
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Tabs defaultValue="list" className="w-full">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="mt-6">
              {filteredLogs.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Work Logs</h3>
                    <p className="text-muted-foreground mb-4">
                      No work logs found for the selected time period.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredLogs.map((log) => (
                    <Card key={log.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <p className="font-medium">
                                {format(parseISO(log.start_time), "PPP")}
                              </p>
                              <Badge variant={log.status === 'active' ? "secondary" : "outline"}>
                                {log.status === 'active' ? 'Active' : 'Completed'}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Time In</p>
                                <p>{format(parseISO(log.start_time), "p")}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm text-muted-foreground">Time Out</p>
                                <p>{log.end_time ? format(parseISO(log.end_time), "p") : "Not ended"}</p>
                              </div>
                              
                              {log.earnings !== null && log.earnings > 0 && (
                                <div>
                                  <p className="text-sm text-muted-foreground">Earnings</p>
                                  <p className="flex items-center">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    {log.earnings.toFixed(2)}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            {log.end_time && (
                              <div className="mt-2">
                                <p className="text-sm text-muted-foreground">Session Duration</p>
                                <p>{calculateSessionDuration(log.start_time, log.end_time)}</p>
                              </div>
                            )}
                            
                            {log.notes && (
                              <div className="mt-2">
                                <p className="text-sm text-muted-foreground">Notes</p>
                                <p className="text-sm mt-1">{log.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Calendar View</h3>
                  <p className="text-muted-foreground mb-4">
                    Calendar view will be implemented in a future update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </>
  );
};

// Helper function to calculate session duration in hours and minutes
const calculateSessionDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const diffMinutes = (end - start) / (1000 * 60);
  
  const hours = Math.floor(diffMinutes / 60);
  const minutes = Math.floor(diffMinutes % 60);
  
  if (hours === 0) {
    return `${minutes} minutes`;
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
};

export default WorkLogsTab;
