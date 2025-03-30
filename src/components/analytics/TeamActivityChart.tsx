
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
    <ResponsiveContainer width="100%" height={isMobile ? 250 : "100%"}>
      <BarChart 
        data={chartData} 
        margin={{ 
          top: 5, 
          right: isMobile ? 5 : 30, 
          left: isMobile ? 0 : 20, 
          bottom: isMobile ? 60 : 5 
        }}
      >
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: isMobile ? 10 : 12 }}
          tickMargin={isMobile ? 5 : 5}
          angle={isMobile ? -45 : 0}
          textAnchor={isMobile ? "end" : "middle"}
          height={isMobile ? 60 : 30}
        />
        <YAxis 
          tick={{ fontSize: isMobile ? 10 : 12 }}
          width={isMobile ? 30 : 40}
        />
        <Tooltip 
          contentStyle={{ fontSize: isMobile ? 10 : 12 }}
          labelStyle={{ fontSize: isMobile ? 11 : 14 }}
        />
        <Legend 
          wrapperStyle={{ 
            fontSize: isMobile ? 10 : 12,
            marginTop: isMobile ? 10 : 0,
            paddingTop: isMobile ? 15 : 0
          }} 
        />
        <Bar dataKey="Hours Worked" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};
