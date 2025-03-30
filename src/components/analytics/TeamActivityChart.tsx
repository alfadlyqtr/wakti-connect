
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
