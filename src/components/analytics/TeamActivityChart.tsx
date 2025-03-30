
import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { getStaffPerformanceData } from "@/utils/businessAnalyticsUtils";
import { useIsMobile } from "@/hooks/use-mobile";

export const TeamActivityChart: React.FC = () => {
  const data = getStaffPerformanceData();
  const isMobile = useIsMobile();

  // Format data for the chart
  const chartData = data.datasets[0].data.map((value, index) => ({
    name: isMobile ? data.labels[index].split(' ')[0] : data.labels[index], // Only first name on mobile
    "Hours Worked": value,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ 
        top: 5, 
        right: isMobile ? 10 : 30, 
        left: isMobile ? 0 : 20, 
        bottom: isMobile ? 25 : 5 
      }}>
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: isMobile ? 10 : 12 }}
          tickMargin={isMobile ? 10 : 5}
          angle={isMobile ? -45 : 0}
          height={isMobile ? 60 : 30}
        />
        <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
        <Tooltip 
          contentStyle={{ fontSize: isMobile ? 10 : 12 }}
          labelStyle={{ fontSize: isMobile ? 11 : 14 }}
        />
        <Legend 
          wrapperStyle={{ 
            fontSize: isMobile ? 10 : 12,
            marginTop: isMobile ? 10 : 0
          }} 
        />
        <Bar dataKey="Hours Worked" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};
