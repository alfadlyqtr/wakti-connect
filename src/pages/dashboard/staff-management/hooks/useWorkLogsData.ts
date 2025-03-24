
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WorkLog } from "../types";
import { getDateRange } from "../utils/workLogUtils";

export const useWorkLogsData = (initialStaffId: string | null) => {
  const [selectedStaff, setSelectedStaff] = useState<string | null>(initialStaffId);
  const [timeRange, setTimeRange] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

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
      const { start, end } = getDateRange(timeRange, customStartDate, customEndDate);
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

  return {
    selectedStaff,
    setSelectedStaff,
    timeRange,
    setTimeRange,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    staffMembers,
    staffLoading,
    workLogs,
    logsLoading
  };
};
