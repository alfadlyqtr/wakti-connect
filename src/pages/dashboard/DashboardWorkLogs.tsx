
import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, User, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface WorkSession {
  id: string;
  staff_id: string;
  start_time: string;
  end_time: string | null;
  date: string;
  earnings: number;
  notes: string;
}

interface StaffWithSessions extends Staff {
  sessions: WorkSession[];
}

const DashboardWorkLogs = () => {
  const [expandedStaff, setExpandedStaff] = useState<string[]>([]);

  const toggleStaffExpansion = (staffId: string) => {
    if (expandedStaff.includes(staffId)) {
      setExpandedStaff(expandedStaff.filter(id => id !== staffId));
    } else {
      setExpandedStaff([...expandedStaff, staffId]);
    }
  };
  
  // Fetch staff and their work sessions
  const { data: staffData, isLoading } = useQuery({
    queryKey: ['staffWithSessions'],
    queryFn: async () => {
      // First, get all staff
      const { data: staffMembers, error: staffError } = await supabase.rpc('get_business_staff_with_details');
      
      if (staffError) {
        throw new Error(`Error fetching staff: ${staffError.message}`);
      }
      
      // For each staff member, get their work sessions
      const staffWithSessions: StaffWithSessions[] = [];
      
      for (const staff of (staffMembers as Staff[] || [])) {
        const { data: sessions, error: sessionsError } = await supabase
          .from('work_sessions')
          .select('*')
          .eq('staff_id', staff.id)
          .order('date', { ascending: false });
          
        if (sessionsError) {
          console.error(`Error fetching sessions for staff ${staff.id}:`, sessionsError);
        }
        
        staffWithSessions.push({
          ...staff,
          sessions: sessions || []
        });
      }
      
      return staffWithSessions;
    }
  });

  // Calculate total hours for a session
  const calculateHours = (session: WorkSession) => {
    if (!session.end_time) return "In progress";
    
    const start = new Date(session.start_time).getTime();
    const end = new Date(session.end_time).getTime();
    const hours = (end - start) / (1000 * 60 * 60);
    
    return hours.toFixed(2);
  };
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time to readable format
  const formatTime = (timeString: string | null) => {
    if (!timeString) return "—";
    
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Staff Work Logs</h1>
        <p className="text-muted-foreground">Track staff hours, sessions, and earnings</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {!staffData || staffData.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-[300px]">
                <User className="h-16 w-16 text-muted mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Staff Found</h3>
                <p className="text-muted-foreground mb-4 text-center max-w-md">
                  You don't have any staff members added yet. Add staff members to start tracking their work hours.
                </p>
                <Button>Add Staff Member</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {staffData.map(staff => (
                <Card key={staff.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center">
                        <User className="mr-2 h-5 w-5" />
                        {staff.name}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          ({staff.role})
                        </span>
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleStaffExpansion(staff.id)}
                      >
                        <ChevronDown className={`h-5 w-5 transition-transform ${
                          expandedStaff.includes(staff.id) ? 'rotate-180' : ''
                        }`} />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {expandedStaff.includes(staff.id) && (
                    <CardContent>
                      {staff.sessions.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                          No work sessions recorded yet
                        </p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Start Time</TableHead>
                              <TableHead>End Time</TableHead>
                              <TableHead>Hours</TableHead>
                              <TableHead>Earnings</TableHead>
                              <TableHead>Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {staff.sessions.map(session => (
                              <TableRow key={session.id}>
                                <TableCell>{formatDate(session.date)}</TableCell>
                                <TableCell>{formatTime(session.start_time)}</TableCell>
                                <TableCell>{formatTime(session.end_time)}</TableCell>
                                <TableCell>{calculateHours(session)}</TableCell>
                                <TableCell>${session.earnings.toFixed(2)}</TableCell>
                                <TableCell className="max-w-xs truncate">{session.notes}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardWorkLogs;
