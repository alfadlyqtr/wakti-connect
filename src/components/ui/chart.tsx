
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

// Export specific chart types for direct usage
export const LineChart = (props: Omit<ChartProps, 'type'>) => <Chart {...props} type="line" />;
export const BarChart = (props: Omit<ChartProps, 'type'>) => <Chart {...props} type="bar" />;
export const PieChart = (props: Omit<ChartProps, 'type'>) => <Chart {...props} type="pie" />;
export const DoughnutChart = (props: Omit<ChartProps, 'type'>) => <Chart {...props} type="doughnut" />;
export const PolarAreaChart = (props: Omit<ChartProps, 'type'>) => <Chart {...props} type="polarArea" />;
export const RadarChart = (props: Omit<ChartProps, 'type'>) => <Chart {...props} type="radar" />;

// Additional chart components
interface ChartContainerProps {
  children: React.ReactNode;
  config: Record<string, { label: string; color: string }>;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ children, config }) => {
  // Set CSS variables for the chart colors
  React.useEffect(() => {
    Object.entries(config).forEach(([key, { color }]) => {
      document.documentElement.style.setProperty(`--color-${key}`, color);
    });

    return () => {
      Object.keys(config).forEach((key) => {
        document.documentElement.style.removeProperty(`--color-${key}`);
      });
    };
  }, [config]);

  return <>{children}</>;
};

export const ChartTooltip: React.FC<{ content: React.ReactNode }> = ({ content }) => {
  return <div className="bg-white p-2 shadow-lg rounded-lg border text-xs">{content}</div>;
};

export const ChartTooltipContent: React.FC<any> = (props) => {
  if (!props.active || !props.payload) {
    return null;
  }

  return (
    <div className="bg-white p-2 shadow-lg rounded-lg border">
      <p className="font-medium">{props.label}</p>
      <div className="space-y-1 mt-1">
        {props.payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color || `var(--color-${item.dataKey})` }}
            />
            <span className="text-xs">{item.name || item.dataKey}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
