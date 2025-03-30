
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
    <ResponsiveContainer width="100%" height={isMobile ? 300 : "100%"}>
      <BarChart 
        data={chartData} 
        margin={{ 
          top: 10, 
          right: isMobile ? 10 : 30, 
          left: isMobile ? 5 : 20, 
          bottom: isMobile ? 70 : 5 
        }}
        barSize={isMobile ? 20 : 40}
      >
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: isMobile ? 11 : 12 }}
          tickMargin={isMobile ? 10 : 5}
          angle={isMobile ? -45 : 0}
          textAnchor={isMobile ? "end" : "middle"}
          height={isMobile ? 70 : 30}
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
