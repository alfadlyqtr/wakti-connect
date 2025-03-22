
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, PolarArea, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

type ChartDataType = {
  labels: string[];
  datasets: any[];
};

type ChartOptionsType = {
  responsive?: boolean;
  plugins?: any;
  scales?: any;
  maintainAspectRatio?: boolean;
  [key: string]: any;
};

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'polarArea' | 'radar';
  data: ChartDataType;
  options?: ChartOptionsType;
  height?: number;
  width?: number;
}

const defaultOptions: ChartOptionsType = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};

export function Chart({
  type,
  data,
  options = defaultOptions,
  className,
  height,
  width,
  ...props
}: ChartProps) {
  const chartOptions = { ...defaultOptions, ...options };
  
  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={chartOptions} height={height} width={width} />;
      case 'bar':
        return <Bar data={data} options={chartOptions} height={height} width={width} />;
      case 'pie':
        return <Pie data={data} options={chartOptions} height={height} width={width} />;
      case 'doughnut':
        return <Doughnut data={data} options={chartOptions} height={height} width={width} />;
      case 'polarArea':
        return <PolarArea data={data} options={chartOptions} height={height} width={width} />;
      case 'radar':
        return <Radar data={data} options={chartOptions} height={height} width={width} />;
      default:
        return <div>Unsupported chart type: {type}</div>;
    }
  };

  return (
    <div className={cn("w-full h-full", className)} {...props}>
      {renderChart()}
    </div>
  );
}
