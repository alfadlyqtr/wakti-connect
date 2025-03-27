
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, startOfWeek, startOfMonth, subDays, eachDayOfInterval, addDays } from 'date-fns';
import { JobCard } from '@/types/jobs.types';
import { BarChart } from '@/components/ui/chart';

interface JobCardPerformanceChartProps {
  jobCards: JobCard[];
  timeRange: string;
}

const JobCardPerformanceChart: React.FC<JobCardPerformanceChartProps> = ({
  jobCards,
  timeRange
}) => {
  const chartData = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let interval = 'day';
    
    // Determine date range based on time range
    switch (timeRange) {
      case 'week':
        startDate = startOfWeek(now);
        interval = 'day';
        break;
      case 'month':
        startDate = startOfMonth(now);
        interval = 'day';
        break;
      case 'quarter':
        startDate = subDays(now, 90);
        interval = 'week';
        break;
      case 'year':
        startDate = subDays(now, 365);
        interval = 'month';
        break;
      default:
        startDate = startOfMonth(now);
        interval = 'day';
    }
    
    // Generate date interval
    let dateInterval;
    if (interval === 'day') {
      dateInterval = eachDayOfInterval({ start: startDate, end: now });
    } else if (interval === 'week') {
      // For weeks, create an array of weekly intervals
      dateInterval = [];
      let currentDate = startDate;
      while (currentDate <= now) {
        dateInterval.push(currentDate);
        currentDate = addDays(currentDate, 7);
      }
    } else {
      // For months, this is simplified (would need a more complex approach for exact months)
      dateInterval = [];
      let currentDate = startDate;
      while (currentDate <= now) {
        dateInterval.push(currentDate);
        // Approximate a month as 30 days
        currentDate = addDays(currentDate, 30);
      }
    }
    
    // Map earnings and job counts for each interval
    const labels = dateInterval.map(date => {
      if (interval === 'day') return format(date, 'MMM d');
      if (interval === 'week') return `W${format(date, 'w')}`;
      return format(date, 'MMM yyyy');
    });
    
    const earningsData = dateInterval.map(date => {
      const nextDate = interval === 'day' 
        ? addDays(date, 1) 
        : interval === 'week' 
          ? addDays(date, 7) 
          : addDays(date, 30);
      
      return jobCards
        .filter(job => {
          const jobDate = new Date(job.start_time);
          return jobDate >= date && jobDate < nextDate && job.end_time;
        })
        .reduce((sum, job) => sum + job.payment_amount, 0);
    });
    
    const jobCountData = dateInterval.map(date => {
      const nextDate = interval === 'day' 
        ? addDays(date, 1) 
        : interval === 'week' 
          ? addDays(date, 7) 
          : addDays(date, 30);
      
      return jobCards
        .filter(job => {
          const jobDate = new Date(job.start_time);
          return jobDate >= date && jobDate < nextDate && job.end_time;
        })
        .length;
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Earnings',
          data: earningsData,
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Job Count',
          data: jobCountData,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
          type: 'line',
          yAxisID: 'y1'
        }
      ]
    };
  }, [jobCards, timeRange]);
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Earnings ($)'
        }
      },
      y1: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Job Count'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <BarChart data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCardPerformanceChart;
