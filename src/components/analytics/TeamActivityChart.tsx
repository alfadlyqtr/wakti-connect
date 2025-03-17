
import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { getStaffPerformanceData } from "@/utils/businessAnalyticsUtils";

export const TeamActivityChart: React.FC = () => {
  const data = getStaffPerformanceData();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data.datasets[0].data.map((value, index) => ({
        name: data.labels[index],
        "Hours Worked": value,
      }))}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Hours Worked" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};
