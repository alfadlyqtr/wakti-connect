
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/date-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, DollarSign, Filter, Plus, Search } from "lucide-react";
import { format, startOfDay, endOfDay, parseISO } from "date-fns";
import { toast } from "@/components/ui/use-toast";

interface WorkLog {
  id: string;
  staff_relation_id: string;
  start_time: string;
  end_time: string;
  earnings: number;
  notes: string;
  created_at: string;
  updated_at: string;
  staff?: {
    profile?: {
      full_name: string;
    };
  };
}

interface StaffMember {
  id: string;
  staff_id: string;
  business_id: string;
  role: string;
  created_at: string;
  profile?: {
    full_name: string;
    avatar_url: string;
  } | null;
}

const DashboardWorkLogs = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newLogOpen, setNewLogOpen] = useState(false);
  const [staffMember, setStaffMember] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [earnings, setEarnings] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch work logs
  const { data: workLogs, isLoading: logsLoading, refetch: refetchLogs } = useQuery({
    queryKey: ['workLogs', selectedDate],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) throw new Error('Not authenticated');

      const startDate = startOfDay(selectedDate).toISOString();
      const endDate = endOfDay(selectedDate).toISOString();

      // Fetch work logs for the selected date
      const { data, error } = await supabase
        .from('work_logs')
        .select(`
          id,
          staff_relation_id,
          start_time,
          end_time,
          earnings,
          notes,
          created_at,
          updated_at,
          staff:staff_relation_id(
            profile:staff_id(
              full_name
            )
          )
        `)
        .eq('business_id', session.session.user.id)
        .gte('start_time', startDate)
        .lte('end_time', endDate);

      if (error) throw error;

      // Transform data to handle potentially missing staff property
      const transformedData: WorkLog[] = data.map(log => {
        // If staff property is missing, create a fallback
        if (!log.staff) {
          return {
            ...log, 
            staff: { 
              profile: { 
                full_name: "Unknown Staff" 
              } 
            }
          };
        }
        return log;
      });

      return transformedData;
    }
  });

  // Fetch staff members
  const { data: staffMembers, isLoading: staffLoading } = useQuery({
    queryKey: ['staffMembers'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) throw new Error('Not authenticated');

      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .select('id, staff_id, business_id, role, created_at')
        .eq('business_id', session.session.user.id);

      if (staffError) throw staffError;

      // Now we need to fetch profiles for each staff member
      const staffWithProfiles: StaffMember[] = await Promise.all(
        staffData.map(async (staff) => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', staff.staff_id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            return {
              ...staff,
              profile: null
            };
          }

          return {
            ...staff,
            profile: profileData
          };
        })
      );

      return staffWithProfiles;
    }
  });

  const handleAddWorkLog = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) throw new Error('Not authenticated');

      // Validate inputs
      if (!staffMember || !startTime || !endTime) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      // Format the start and end times
      const formattedStartTime = `${format(selectedDate, 'yyyy-MM-dd')}T${startTime}:00`;
      const formattedEndTime = `${format(selectedDate, 'yyyy-MM-dd')}T${endTime}:00`;

      // Insert work log
      const { error } = await supabase
        .from('work_logs')
        .insert({
          business_id: session.session.user.id,
          staff_relation_id: staffMember,
          start_time: formattedStartTime,
          end_time: formattedEndTime,
          earnings: parseFloat(earnings) || 0,
          notes
        });

      if (error) throw error;

      toast({
        title: "Work log added",
        description: "The work log has been successfully recorded"
      });

      // Reset form and close dialog
      setStaffMember("");
      setStartTime("");
      setEndTime("");
      setEarnings("");
      setNotes("");
      setNewLogOpen(false);

      // Refetch work logs
      refetchLogs();
    } catch (error) {
      console.error("Error adding work log:", error);
      toast({
        title: "Error",
        description: "Failed to add work log. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Calculate total earnings for the day
  const totalEarnings = workLogs ? workLogs.reduce((sum, log) => sum + (log.earnings || 0), 0) : 0;

  // Format time from ISO string to readable format
  const formatTime = (isoTime: string) => {
    try {
      return format(parseISO(isoTime), 'h:mm a');
    } catch (error) {
      return "Invalid time";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold mb-2">Work Logs</h1>
        <p className="text-muted-foreground">Track your staff working hours and earnings.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <DatePicker
            date={selectedDate}
            setDate={setSelectedDate}
            className="w-full sm:w-[240px]"
          />
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Dialog open={newLogOpen} onOpenChange={setNewLogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Log
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Work Log</DialogTitle>
                <DialogDescription>
                  Record a staff member's work hours and earnings for {format(selectedDate, 'MMMM d, yyyy')}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="staff">Staff Member</Label>
                  <select
                    id="staff"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={staffMember}
                    onChange={(e) => setStaffMember(e.target.value)}
                  >
                    <option value="">Select staff member</option>
                    {staffMembers?.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.profile?.full_name || "Unknown"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="earnings">Earnings (optional)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="earnings"
                      type="number"
                      placeholder="0.00"
                      className="pl-9"
                      value={earnings}
                      onChange={(e) => setEarnings(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional information here..."
                    className="min-h-[80px]"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewLogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddWorkLog}>Save Log</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              Total Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logsLoading ? (
                <div className="h-7 w-16 animate-pulse bg-muted rounded"></div>
              ) : workLogs?.length ? (
                workLogs.reduce((total, log) => {
                  const start = new Date(log.start_time).getTime();
                  const end = new Date(log.end_time).getTime();
                  return total + (end - start) / (1000 * 60 * 60);
                }, 0).toFixed(1)
              ) : (
                "0.0"
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Hours worked on {format(selectedDate, 'MMM d, yyyy')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logsLoading ? (
                <div className="h-7 w-20 animate-pulse bg-muted rounded"></div>
              ) : (
                `$${totalEarnings.toFixed(2)}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Earnings on {format(selectedDate, 'MMM d, yyyy')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Work Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-full h-12 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          ) : workLogs?.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No work logs</h3>
              <p className="text-muted-foreground">
                There are no work logs recorded for {format(selectedDate, 'MMMM d, yyyy')}.
              </p>
              <Button 
                className="mt-4" 
                onClick={() => setNewLogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Log
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workLogs?.map((log) => {
                  const startDate = new Date(log.start_time);
                  const endDate = new Date(log.end_time);
                  const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
                  
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {log.staff?.profile?.full_name || "Unknown Staff"}
                      </TableCell>
                      <TableCell>{formatTime(log.start_time)}</TableCell>
                      <TableCell>{formatTime(log.end_time)}</TableCell>
                      <TableCell>{hours.toFixed(1)}</TableCell>
                      <TableCell>${log.earnings?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{log.notes || "-"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardWorkLogs;
