
import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { getTasksData } from "@/utils/businessAnalyticsUtils";

export const TasksOverviewChart: React.FC = () => {
  const data = getTasksData();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data.datasets[0].data.map((value, index) => ({
        name: data.labels[index],
        Completed: data.datasets[0].data[index],
        "In Progress": data.datasets[1].data[index],
        Pending: data.datasets[2].data[index],
      }))}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Completed" fill="#22c55e" />
        <Bar dataKey="In Progress" fill="#3b82f6" />
        <Bar dataKey="Pending" fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
  );
};
