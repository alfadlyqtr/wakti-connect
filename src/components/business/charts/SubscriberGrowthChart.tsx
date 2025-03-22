
import React, { useState } from 'react';
import { Chart } from '@/components/ui/chart';
import { format, subMonths } from 'date-fns';
import { Line } from 'react-chartjs-2';

const SubscriberGrowthChart = () => {
  const [activeTooltip, setActiveTooltip] = useState<{x: number, y: number, value: number, date: string} | null>(null);

  // Mock data for demonstration
  const months = Array.from({ length: 6 }, (_, i) => format(subMonths(new Date(), i), 'MMM'));
  const values = [45, 52, 68, 74, 89, 112];
  
  const chartData = {
    labels: months.reverse(),
    datasets: [
      {
        label: 'Subscribers',
        data: values,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true,
      }
    ]
  };

  return (
    <Chart.Container 
      className="h-[300px]" 
      config={{ subscribers: { label: 'Subscribers', color: '#10b981' } }}
    >
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
          interaction: {
            intersect: false,
            mode: 'index',
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
              external: (context) => {
                const { chart, tooltip } = context;
                if (tooltip.opacity === 0) {
                  setActiveTooltip(null);
                  return;
                }
                
                const index = tooltip.dataPoints[0].dataIndex;
                setActiveTooltip({
                  x: chart.canvas.offsetLeft + tooltip.caretX,
                  y: chart.canvas.offsetTop + tooltip.caretY,
                  value: values[index],
                  date: months[index]
                });
              }
            }
          }
        }}
      />
      
      {activeTooltip && (
        <Chart.Tooltip>
          <Chart.TooltipContent 
            title={activeTooltip.date}
            value={`${activeTooltip.value} subscribers`}
          />
        </Chart.Tooltip>
      )}
    </Chart.Container>
  );
};

export default SubscriberGrowthChart;
