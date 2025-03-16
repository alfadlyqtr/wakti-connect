
import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, User, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface WorkSession {
  id: string;
  staff_relation_id: string;
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
  const { toast } = useToast();

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
      try {
        // First, get all business staff relationships
        const { data: staffRelations, error: staffError } = await supabase
          .from('business_staff')
          .select('*, profiles(id, full_name, account_type)');
        
        if (staffError) {
          throw new Error(`Error fetching staff: ${staffError.message}`);
        }
        
        // Transform staff data into the format we need
        const staffMembers: Staff[] = (staffRelations || []).map(relation => ({
          id: relation.staff_id,
          name: relation.profiles?.full_name || 'Unknown User',
          role: relation.role,
          email: ''  // We don't have direct access to email
        }));
        
        // For each staff member, get their work sessions
        const staffWithSessions: StaffWithSessions[] = [];
        
        for (const staff of staffMembers) {
          // Find the staff_relation_id
          const relation = staffRelations.find(r => r.staff_id === staff.id);
          
          if (relation) {
            const { data: sessions, error: sessionsError } = await supabase
              .from('staff_work_logs')
              .select('*')
              .eq('staff_relation_id', relation.id);
              
            if (sessionsError) {
              console.error(`Error fetching sessions for staff ${staff.id}:`, sessionsError);
              toast({
                title: "Error fetching work logs",
                description: sessionsError.message,
                variant: "destructive"
              });
            }
            
            // Transform the sessions to include a date field
            const formattedSessions = (sessions || []).map(session => ({
              ...session,
              date: new Date(session.start_time).toISOString().split('T')[0]
            }));
            
            staffWithSessions.push({
              ...staff,
              sessions: formattedSessions
            });
          }
        }
        
        return staffWithSessions;
      } catch (error) {
        console.error("Error in staffWithSessions query:", error);
        toast({
          title: "Error loading staff data",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive"
        });
        return [];
      }
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
