
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type WorkLog = {
  id: string;
  staff_id: string;
  start_time: string;
  end_time: string | null;
  earnings: number | null;
  notes: string | null;
  created_at: string;
  date: string;
};

type Staff = {
  id: string;
  name: string;
  role: string;
  email: string;
};

const DashboardWorkLogs = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [earnings, setEarnings] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load staff members data
  const { data: staffMembers, isLoading: staffLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('business_staff')
        .select(`
          id,
          name,
          role,
          email
        `)
        .eq('business_id', session.session.user.id);
        
      if (error) throw error;
      
      return (data || []) as Staff[];
    }
  });

  // Load work logs for the selected date
  const { data: workLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['workLogs', date],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      // Note: Assuming a 'work_logs' table exists in your database
      // If it doesn't, you'll need to create it or modify this query
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Using a custom query instead of the from() method to avoid type errors
      const { data, error } = await supabase.rpc('get_work_logs', {
        business_id_param: session.session.user.id,
        date_param: formattedDate
      });
      
      if (error) throw error;
      
      // Map staff names to work logs
      const logsWithStaffDetails = (data || []).map((log: any) => {
        const staffMember = staffMembers?.find(staff => staff.id === log.staff_id);
        return {
          ...log,
          staffName: staffMember ? staffMember.name : 'Unknown'
        };
      });
      
      return logsWithStaffDetails;
    },
    enabled: !!staffMembers // Only run this query when staffMembers are loaded
  });

  // Start day mutation
  const startDayMutation = useMutation({
    mutationFn: async () => {
      if (!selectedStaff) {
        throw new Error('Please select a staff member');
      }
      
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const formattedDate = format(date, 'yyyy-MM-dd');
      const now = new Date().toISOString();
      
      // Using rpc to handle custom work log creation
      const { data, error } = await supabase.rpc('create_work_log', {
        staff_id_param: selectedStaff,
        business_id_param: session.session.user.id, 
        date_param: formattedDate,
        start_time_param: now
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Day Started",
        description: "Work log has been started successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['workLogs'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start work log."
      });
    }
  });

  // End day mutation
  const endDayMutation = useMutation({
    mutationFn: async (logId: string) => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const now = new Date().toISOString();
      const earningsValue = earnings ? parseFloat(earnings) : null;
      
      // Using rpc to handle work log updates
      const { data, error } = await supabase.rpc('update_work_log', {
        log_id_param: logId,
        end_time_param: now,
        earnings_param: earningsValue,
        notes_param: notes
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Day Ended",
        description: "Work log has been updated successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['workLogs'] });
      setEarnings('');
      setNotes('');
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update work log."
      });
    }
  });

  const handleStartDay = () => {
    startDayMutation.mutate();
  };

  const handleEndDay = (logId: string) => {
    endDayMutation.mutate(logId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Staff Work Logs</h1>
        <p className="text-muted-foreground">Track staff working hours and daily earnings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Log Work</CardTitle>
            <CardDescription>
              Record staff working hours and earnings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="staff">Staff Member</Label>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger id="staff">
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staffLoading ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : staffMembers && staffMembers.length > 0 ? (
                    staffMembers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name} ({staff.role})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No staff members found</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="earnings">Earnings (Optional)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="earnings"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="pl-10"
                  value={earnings}
                  onChange={(e) => setEarnings(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Add any additional notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button 
              className="w-full" 
              onClick={handleStartDay} 
              disabled={!selectedStaff || startDayMutation.isPending}
            >
              <Clock className="mr-2 h-4 w-4" />
              Start Day
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Today's Logs</CardTitle>
            <CardDescription>
              {format(date, "PPP")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
              </div>
            ) : workLogs && workLogs.length > 0 ? (
              <div className="space-y-4">
                {workLogs.map((log: any) => (
                  <Card key={log.id} className="overflow-hidden">
                    <div className={cn(
                      "px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
                      log.end_time ? "bg-muted/50" : "bg-muted-foreground/5"
                    )}>
                      <div>
                        <h3 className="font-medium">{log.staffName}</h3>
                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3.5 w-3.5" />
                          {log.start_time ? format(new Date(log.start_time), "h:mm a") : "N/A"}
                          {log.end_time && (
                            <> - {format(new Date(log.end_time), "h:mm a")}</>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {log.earnings && (
                          <div className="text-sm font-medium text-green-600 flex items-center">
                            <DollarSign className="mr-1 h-3.5 w-3.5" />
                            {parseFloat(log.earnings).toFixed(2)}
                          </div>
                        )}
                        
                        {!log.end_time && (
                          <Button 
                            size="sm" 
                            onClick={() => handleEndDay(log.id)}
                            disabled={endDayMutation.isPending}
                          >
                            End Day
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {log.notes && (
                      <div className="px-6 py-2 border-t text-sm">
                        <p className="text-muted-foreground">{log.notes}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No work logs found for this date</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardWorkLogs;
