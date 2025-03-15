
"use client";

import React from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

// Register all chart.js components
ChartJS.register(...registerables);

interface ChartProps {
  data: any;
  options?: any;
}

export const BarChart = ({ data, options = {} }: ChartProps) => {
  return <Bar data={data} options={options} />;
};

export const LineChart = ({ data, options = {} }: ChartProps) => {
  return <Line data={data} options={options} />;
};

export const PieChart = ({ data, options = {} }: ChartProps) => {
  return <Pie data={data} options={options} />;
};
