
import React, { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const TeamActivityChart: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Add querying for real staff performance data
  const { data: chartData, isLoading, error } = useQuery({
    queryKey: ['staffPerformance'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          throw new Error("Not authenticated");
        }
        
        // Check if user is a business account
        const { data: profile } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', session.user.id)
          .single();
          
        if (profile?.account_type !== 'business') {
          throw new Error("Must be a business account to view staff performance");
        }
        
        // Get staff members with work logs
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .select(`
            id,
            staff_id,
            name,
            staff_work_logs (id, start_time, end_time)
          `)
          .eq('business_id', session.user.id)
          .eq('status', 'active');
        
        if (staffError) throw staffError;
        
        if (!staffData || staffData.length === 0) {
          return [];
        }
        
        // Calculate hours worked for each staff member
        return staffData.map(staff => {
          const workLogs = staff.staff_work_logs || [];
          let hoursWorked = 0;
          
          // Calculate total hours from completed work logs
          workLogs.forEach(log => {
            if (log.start_time && log.end_time) {
              const start = new Date(log.start_time);
              const end = new Date(log.end_time);
              const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
              hoursWorked += diffHours;
            }
          });
          
          // Format name for display
          const name = isMobile ? staff.name.split(' ')[0] : staff.name;
          
          return {
            name,
            "Hours Worked": Math.round(hoursWorked * 10) / 10 // Round to 1 decimal place
          };
        });
      } catch (error) {
        console.error("Error loading staff performance data:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Loading staff data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Error loading data"}
        </p>
      </div>
    );
  }
  
  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p>No staff activity data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
      <BarChart 
        data={chartData} 
        margin={{ 
          top: 20, 
          right: isMobile ? 15 : 30, 
          left: isMobile ? 15 : 20, 
          bottom: isMobile ? 50 : 5 
        }}
        barSize={isMobile ? 25 : 40}
      >
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: isMobile ? 11 : 12 }}
          tickMargin={isMobile ? 5 : 5}
          angle={isMobile ? -30 : 0}
          textAnchor={isMobile ? "end" : "middle"}
          height={isMobile ? 60 : 30}
          interval={0}
        />
        <YAxis 
          tick={{ fontSize: isMobile ? 11 : 12 }}
          width={isMobile ? 35 : 40}
        />
        <Tooltip 
          contentStyle={{ fontSize: isMobile ? 12 : 12 }}
          labelStyle={{ fontSize: isMobile ? 12 : 14 }}
        />
        <Legend 
          wrapperStyle={{ 
            fontSize: isMobile ? 12 : 12,
            marginTop: isMobile ? 5 : 0,
            paddingTop: isMobile ? 10 : 0
          }} 
        />
        <Bar dataKey="Hours Worked" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};
