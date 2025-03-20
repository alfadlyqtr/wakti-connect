
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, Users, UserPlus, Briefcase } from "lucide-react";
import CreateStaffDialog from "@/components/staff/CreateStaffDialog";
import InvitationsTab from "@/components/staff/InvitationsTab";

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
}

interface StaffMember {
  id: string;
  staff_id: string;
  business_id: string;
  role: string;
  created_at: string;
  profile?: Profile | null;
}

interface WorkLog {
  id: string;
  staff_relation_id: string;
  start_time: string;
  end_time: string | null;
  earnings: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const DashboardStaffManagement = () => {
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Fetch staff members
  const { data: staffMembers, isLoading: staffLoading, error: staffError } = useQuery({
    queryKey: ['businessStaff'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      // First fetch the business staff records
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .select('*')
        .eq('business_id', session.session.user.id);
        
      if (staffError) throw staffError;
      
      // Now fetch profile data for each staff member
      const staffWithProfiles = await Promise.all(
        staffData.map(async (staff) => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', staff.staff_id)
            .single();
            
          return {
            ...staff,
            profile: profileError ? null : profileData
          } as StaffMember;
        })
      );
      
      return staffWithProfiles;
    }
  });

  // Fetch work logs for selected staff
  const { data: workLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['staffWorkLogs', selectedStaffId],
    queryFn: async () => {
      if (!selectedStaffId) return [];
      
      const { data, error } = await supabase
        .from('staff_work_logs')
        .select('*')
        .eq('staff_relation_id', selectedStaffId)
        .order('start_time', { ascending: false });
        
      if (error) throw error;
      return data as WorkLog[];
    },
    enabled: !!selectedStaffId
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Staff Management</h1>
          <p className="text-muted-foreground">Manage your staff members, track work hours, and assign services.</p>
        </div>
        <Button className="md:self-start" onClick={() => setCreateDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Staff
        </Button>
      </div>

      <Tabs defaultValue="staff">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="staff">Staff Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="staff" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffLoading ? (
              <Card className="col-span-full flex justify-center p-8">
                <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
              </Card>
            ) : staffError ? (
              <Card className="col-span-full p-8">
                <p className="text-center text-destructive">Error loading staff members</p>
              </Card>
            ) : staffMembers?.length === 0 ? (
              <Card className="col-span-full p-8">
                <div className="text-center">
                  <Users className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Staff Members Yet</h3>
                  <p className="text-muted-foreground mb-4">Invite new staff members to your business.</p>
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Staff
                  </Button>
                </div>
              </Card>
            ) : (
              staffMembers?.map((member) => (
                <Card key={member.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.profile?.avatar_url || ""} alt={member.profile?.full_name || "Staff"} />
                        <AvatarFallback>
                          {member.profile?.full_name?.substring(0, 2) || "ST"}
                        </AvatarFallback>
                      </Avatar>
                      <Badge variant={member.role === "admin" ? "secondary" : "outline"}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2">{member.profile?.full_name || "Unnamed Staff"}</CardTitle>
                    <CardDescription>Joined {new Date(member.created_at).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>3 services assigned</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>12 bookings this month</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setSelectedStaffId(member.id)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="invitations" className="mt-6">
          <InvitationsTab />
        </TabsContent>
      </Tabs>
      
      <TabsContent value="work-logs" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Staff Work Logs</CardTitle>
            <CardDescription>
              Track staff working hours and earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedStaffId ? (
              <div className="text-center py-8">
                <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Staff Member</h3>
                <p className="text-muted-foreground">Select a staff member to view their work logs</p>
              </div>
            ) : logsLoading ? (
              <div className="flex justify-center p-8">
                <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
              </div>
            ) : workLogs?.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Work Logs</h3>
                <p className="text-muted-foreground">This staff member has no work logs yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workLogs?.map((log) => (
                  <div key={log.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">
                          {new Date(log.start_time).toLocaleDateString()}
                        </span>
                      </div>
                      <Badge variant={log.end_time ? "outline" : "secondary"}>
                        {log.end_time ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Start Time</p>
                        <p>{new Date(log.start_time).toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">End Time</p>
                        <p>{log.end_time ? new Date(log.end_time).toLocaleTimeString() : "Not ended"}</p>
                      </div>
                      {log.earnings !== null && (
                        <div className="col-span-2 flex items-center mt-2">
                          <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Earnings: ${log.earnings.toFixed(2)}</span>
                        </div>
                      )}
                      {log.notes && (
                        <div className="col-span-2 mt-2">
                          <p className="text-muted-foreground">Notes</p>
                          <p>{log.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <CreateStaffDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
};

export default DashboardStaffManagement;
