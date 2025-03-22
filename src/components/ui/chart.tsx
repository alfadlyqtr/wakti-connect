
import React from 'react';
import { cn } from "@/lib/utils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  defaults,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Set default options
defaults.font.family = 'Inter, sans-serif';
defaults.plugins.tooltip.backgroundColor = 'hsl(var(--background)';
defaults.plugins.tooltip.titleColor = 'hsl(var(--foreground)';
defaults.plugins.tooltip.bodyColor = 'hsl(var(--foreground)';
defaults.plugins.tooltip.borderColor = 'hsl(var(--border)';
defaults.plugins.tooltip.borderWidth = 1;

interface ChartProps {
  data: ChartData<any>;
  options?: ChartOptions<any>;
  className?: string;
}

export const LineChart = ({ data, options, className }: ChartProps) => {
  return (
    <div className={cn("w-full h-full", className)}>
      <Line 
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          ...options
        }}
      />
    </div>
  );
};

export const BarChart = ({ data, options, className }: ChartProps) => {
  return (
    <div className={cn("w-full h-full", className)}>
      <Bar 
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          ...options
        }}
      />
    </div>
  );
};

export const PieChart = ({ data, options, className }: ChartProps) => {
  return (
    <div className={cn("w-full h-full", className)}>
      <Pie 
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          ...options
        }}
      />
    </div>
  );
};

export const DoughnutChart = ({ data, options, className }: ChartProps) => {
  return (
    <div className={cn("w-full h-full", className)}>
      <Doughnut 
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          ...options
        }}
      />
    </div>
  );
};

// Additional UI components for chart containers and tooltips
interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
  config?: any; // Adding config prop to support additional configuration
}

export const ChartContainer = ({ children, className, config }: ChartContainerProps) => {
  return (
    <div className={cn("relative p-4 bg-card rounded-lg border", className)}>
      {children}
    </div>
  );
};

interface ChartTooltipProps {
  children: React.ReactNode;
}

export const ChartTooltip = ({ children }: ChartTooltipProps) => {
  return (
    <div className="absolute z-50 p-2 bg-popover text-popover-foreground rounded-md shadow-md text-sm">
      {children}
    </div>
  );
};

interface ChartTooltipContentProps {
  title: string;
  value: string | number;
}

export const ChartTooltipContent = ({ title, value }: ChartTooltipContentProps) => {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{title}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
};

export const Chart = {
  Line: LineChart,
  Bar: BarChart,
  Pie: PieChart,
  Doughnut: DoughnutChart,
  Container: ChartContainer,
  Tooltip: ChartTooltip,
  TooltipContent: ChartTooltipContent,
};

export default Chart;
