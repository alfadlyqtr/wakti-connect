
"use client";

import React from "react";
import { Chart as ChartJS, registerables, ChartOptions } from "chart.js";
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

interface TooltipContentProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

export const ChartContainer: React.FC<{
  children: React.ReactNode;
  config: Record<string, { label: string; color: string }>;
}> = ({ children, config }) => {
  // Set CSS variables for chart colors
  React.useEffect(() => {
    const root = document.documentElement;
    Object.entries(config).forEach(([key, { color }]) => {
      root.style.setProperty(`--color-${key}`, color);
    });

    return () => {
      Object.keys(config).forEach((key) => {
        root.style.removeProperty(`--color-${key}`);
      });
    };
  }, [config]);

  return <>{children}</>;
};

export const ChartTooltip: React.FC<{
  content: React.ReactNode;
}> = ({ content }) => {
  return content;
};

export const ChartTooltipContent: React.FC<TooltipContentProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-background border rounded-md shadow-md p-2 text-sm">
      <p className="font-medium">{label}</p>
      {payload.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color || 'var(--color-' + item.name + ')' }}></div>
          <span>{item.name}: {item.value}</span>
        </div>
      ))}
    </div>
  );
};
