
import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const TeamActivityChart: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['teamActivity'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('business_staff_activity')
        .select('staff_name, hours_worked')
        .eq('business_id', session.user.id)
        .eq('time_range', 'month');
        
      if (error) throw error;
      
      return data?.map(item => ({
        name: item.staff_name,
        "Hours Worked": item.hours_worked
      })) || [];
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading team activity data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Could not load team activity data</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Hours Worked" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};
