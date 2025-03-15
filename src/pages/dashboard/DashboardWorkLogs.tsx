
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Clock, 
  DollarSign, 
  Calendar, 
  Plus, 
  Search,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "@/components/ui/use-toast";

interface WorkLog {
  id: string;
  staff_relation_id: string;
  start_time: string;
  end_time: string | null;
  earnings: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  staff?: {
    profile?: {
      full_name: string | null;
    }
  }
}

const DashboardWorkLogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddLog, setOpenAddLog] = useState(false);

  // Fetch work logs
  const { data: workLogs, isLoading, error } = useQuery({
    queryKey: ['workLogs'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      // Fetch staff relations first to get IDs
      const { data: staffRelations, error: staffError } = await supabase
        .from('business_staff')
        .select('id, staff_id')
        .eq('business_id', session.session.user.id);
        
      if (staffError) throw staffError;
      
      if (!staffRelations?.length) {
        return [];
      }
      
      // Get all staff relation IDs
      const staffRelationIds = staffRelations.map(relation => relation.id);
      
      // Fetch all work logs for this business's staff
      const { data: logs, error: logsError } = await supabase
        .from('staff_work_logs')
        .select('*')
        .in('staff_relation_id', staffRelationIds)
        .order('start_time', { ascending: false });
        
      if (logsError) throw logsError;
      
      // Fetch staff names
      const logsWithStaffNames = await Promise.all(logs.map(async (log) => {
        // Find the staff relation
        const staffRelation = staffRelations.find(rel => rel.id === log.staff_relation_id);
        
        if (staffRelation) {
          // Get the staff profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', staffRelation.staff_id)
            .single();
            
          return {
            ...log,
            staff: {
              profile: profileData
            }
          };
        }
        
        return log;
      }));
      
      return logsWithStaffNames;
    }
  });

  // Filter logs based on search query
  const filteredLogs = workLogs?.filter(log => {
    const staffName = log.staff?.profile?.full_name || "";
    const notes = log.notes || "";
    
    return staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           notes.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate duration between start and end time
  const calculateDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return "In progress";
    
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const durationMs = end - start;
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const handleAddWorkLog = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation would go here
    setOpenAddLog(false);
    toast({
      title: "Work log added",
      description: "The work log has been added successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Work Logs</h1>
          <p className="text-muted-foreground">Track and manage staff working hours and earnings.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={openAddLog} onOpenChange={setOpenAddLog}>
            <DialogTrigger asChild>
              <Button className="md:self-start">
                <Plus className="mr-2 h-4 w-4" />
                Add Work Log
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAddWorkLog}>
                <DialogHeader>
                  <DialogTitle>Add New Work Log</DialogTitle>
                  <DialogDescription>
                    Add a new work log for your staff member.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="staff" className="text-right">
                      Staff Member
                    </Label>
                    <select
                      id="staff"
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    >
                      <option value="" disabled selected>Select staff member</option>
                      {/* Staff options would be populated here */}
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">
                      Start Date
                    </Label>
                    <div className="col-span-3">
                      <Input id="startDate" type="datetime-local" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right">
                      End Date
                    </Label>
                    <div className="col-span-3">
                      <Input id="endDate" type="datetime-local" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="earnings" className="text-right">
                      Earnings
                    </Label>
                    <Input
                      id="earnings"
                      type="number"
                      placeholder="0.00"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <textarea
                      id="notes"
                      placeholder="Add any additional notes..."
                      className="col-span-3 min-h-[80px] flex w-full rounded-md border border-input bg-background px-3 py-2"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit">Save Work Log</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by staff or notes..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Work Logs</CardTitle>
          <CardDescription>
            Track staff working hours and earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>Error loading work logs</p>
            </div>
          ) : filteredLogs?.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Work Logs</h3>
              <p className="text-muted-foreground mb-4">No work logs found for your staff.</p>
              <Button onClick={() => setOpenAddLog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Work Log
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs?.map((log) => (
                <div key={log.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">
                        {formatDate(log.start_time)}
                      </span>
                    </div>
                    <Badge variant={log.end_time ? "outline" : "secondary"}>
                      {log.end_time ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Staff Member</p>
                      <p className="font-medium">{log.staff?.profile?.full_name || "Unknown Staff"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time Period</p>
                      <p>{formatTime(log.start_time)} - {log.end_time ? formatTime(log.end_time) : "Ongoing"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p>{calculateDuration(log.start_time, log.end_time)}</p>
                    </div>
                  </div>
                  {log.earnings !== null && (
                    <div className="mt-3 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                      <span className="font-medium">${log.earnings.toFixed(2)}</span>
                    </div>
                  )}
                  {log.notes && (
                    <div className="mt-3 bg-muted/50 p-2 rounded-md">
                      <div className="flex items-center gap-1 mb-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Notes</span>
                      </div>
                      <p className="text-sm">{log.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardWorkLogs;
