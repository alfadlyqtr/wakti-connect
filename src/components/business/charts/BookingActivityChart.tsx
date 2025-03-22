
import React, { useState } from 'react';
import { Chart } from '@/components/ui/chart';
import { format, subDays } from 'date-fns';
import { Line } from 'react-chartjs-2';

const BookingActivityChart = () => {
  const [activeTooltip, setActiveTooltip] = useState<{x: number, y: number, value: number, date: string} | null>(null);

  // Mock data for demonstration
  const dates = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), 'MMM dd'));
  const values = [8, 12, 5, 18, 10, 14, 7];
  
  const chartData = {
    labels: dates.reverse(),
    datasets: [
      {
        label: 'Bookings',
        data: values,
        borderColor: '#4361ee',
        backgroundColor: 'rgba(67, 97, 238, 0.1)',
        tension: 0.3,
        fill: true,
      }
    ]
  };

  return (
    <Chart.Container 
      className="h-[300px]" 
      config={{ bookings: { label: 'Bookings', color: '#4361ee' } }}
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
                  date: dates[index]
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
            value={`${activeTooltip.value} bookings`}
          />
        </Chart.Tooltip>
      )}
    </Chart.Container>
  );
};

export default BookingActivityChart;
