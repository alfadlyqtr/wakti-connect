
import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

// Mock data for the chart
const mockData = [
  { month: "Jan", "Completed": 45, "In Progress": 20, "Pending": 15 },
  { month: "Feb", "Completed": 50, "In Progress": 25, "Pending": 20 },
  { month: "Mar", "Completed": 35, "In Progress": 15, "Pending": 10 },
  { month: "Apr", "Completed": 60, "In Progress": 30, "Pending": 25 },
  { month: "May", "Completed": 40, "In Progress": 20, "Pending": 15 },
  { month: "Jun", "Completed": 55, "In Progress": 25, "Pending": 20 },
];

export const TasksOverviewChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={mockData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Completed" stroke="#22c55e" strokeWidth={2} />
        <Line type="monotone" dataKey="In Progress" stroke="#3b82f6" strokeWidth={2} />
        <Line type="monotone" dataKey="Pending" stroke="#f59e0b" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};
