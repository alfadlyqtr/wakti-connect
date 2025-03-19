import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  Calendar as CalendarIcon,
  ClipboardList
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format } from "date-fns";

interface StaffMember {
  id: string;
  name: string;
  email: string | null;
  role: string;
  position: string;
  created_at: string;
  staff_id: string;
  staff_number: string;
  is_service_provider: boolean;
  status: 'active' | 'suspended' | 'deleted';
  profile_image_url: string | null;
  sessions?: {
    id: string;
    staff_relation_id: string;
    start_time: string;
    end_time: string | null;
    status: string;
    notes: string | null;
    earnings: number;
    created_at: string;
    updated_at: string;
  }[];
}

const formatDuration = (start: string, end: string | null) => {
  if (!end) return "In progress";
  
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMillis = endDate.getTime() - startDate.getTime();
  
  const hours = Math.floor(diffMillis / (1000 * 60 * 60));
  const minutes = Math.floor((diffMillis % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

const WorkLogsTab = () => {
  const [activeTab, setActiveTab] = useState("all-staff");
  
  const { data: staffWithSessions, isLoading } = useQuery({
    queryKey: ['staffWorkLogs'],
    queryFn: async () => {
      try {
        // Get all business staff
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .select('*')
          .throwOnError();
        
        if (staffError) {
          throw staffError;
        }

        const staffMembers: StaffMember[] = staffData.map(staff => {
          return {
            ...staff,
            staff_number: staff.staff_number || `TEMP_${staff.id.substring(0, 5)}`,
            is_service_provider: staff.is_service_provider || false,
            status: (staff.status as 'active' | 'suspended' | 'deleted') || 'active',
            profile_image_url: staff.profile_image_url || null,
            permissions: staff.permissions || {
              can_track_hours: true,
              can_message_staff: true,
              can_create_job_cards: true,
              can_view_own_analytics: true
            }
          };
        });
        
        // For each staff member, get their work sessions
        const staffWithSessions: StaffMember[] = [];
        
        for (const staff of staffMembers) {
          const { data: sessions, error: sessionsError } = await supabase
            .from('staff_work_logs')
            .select('*')
            .eq('staff_relation_id', staff.id);
              
          if (sessionsError) {
            console.error(`Error fetching sessions for staff ${staff.id}:`, sessionsError);
          }
            
          staffWithSessions.push({
            ...staff,
            sessions: sessions || []
          });
        }
        
        return staffWithSessions;
      } catch (error) {
        console.error("Error in staff work logs query:", error);
        return [];
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Work Logs</h2>
      </div>
      
      <Tabs defaultValue="all-staff" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all-staff">All Staff</TabsTrigger>
          {staffWithSessions?.map((staff) => (
            <TabsTrigger key={staff.id} value={staff.id}>
              {staff.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all-staff" className="border-none p-0">
          <Card>
            <CardContent className="p-4">
              {isLoading ? (
                <p>Loading work logs...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffWithSessions?.map((staff) => (
                      staff.sessions?.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>{staff.name}</TableCell>
                          <TableCell>{format(new Date(session.start_time), "PPpp")}</TableCell>
                          <TableCell>
                            {session.end_time ? format(new Date(session.end_time), "PPpp") : "In progress"}
                          </TableCell>
                          <TableCell>
                            {formatDuration(session.start_time, session.end_time)}
                          </TableCell>
                          <TableCell>{session.earnings || "N/A"}</TableCell>
                          <TableCell>{session.notes || "N/A"}</TableCell>
                        </TableRow>
                      ))
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {staffWithSessions?.map((staff) => (
          <TabsContent key={staff.id} value={staff.id} className="border-none p-0">
            <Card>
              <CardContent className="p-4">
                {isLoading ? (
                  <p>Loading work logs for {staff.name}...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Earnings</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staff.sessions?.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>{format(new Date(session.start_time), "PPpp")}</TableCell>
                          <TableCell>
                            {session.end_time ? format(new Date(session.end_time), "PPpp") : "In progress"}
                          </TableCell>
                          <TableCell>
                            {formatDuration(session.start_time, session.end_time)}
                          </TableCell>
                          <TableCell>{session.earnings || "N/A"}</TableCell>
                          <TableCell>{session.notes || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default WorkLogsTab;
