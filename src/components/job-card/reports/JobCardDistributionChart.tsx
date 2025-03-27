
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobCard } from '@/types/jobs.types';
import { PieChart } from '@/components/ui/chart';

interface JobCardDistributionChartProps {
  jobCards: JobCard[];
  timeRange: string;
}

const JobCardDistributionChart: React.FC<JobCardDistributionChartProps> = ({
  jobCards,
  timeRange
}) => {
  // Create datasets for charts
  const { jobTypeData, paymentMethodData } = useMemo(() => {
    // Filter completed jobs
    const completedJobs = jobCards.filter(job => job.end_time);
    
    // Count jobs by type
    const jobTypeCounts: Record<string, number> = {};
    completedJobs.forEach(job => {
      const jobName = job.job?.name || 'Unknown';
      jobTypeCounts[jobName] = (jobTypeCounts[jobName] || 0) + 1;
    });
    
    // Convert to chart data format
    const jobTypeLabels = Object.keys(jobTypeCounts);
    const jobTypeValues = Object.values(jobTypeCounts);
    
    // Generate colors for pie chart segments
    const colors = [
      'rgba(59, 130, 246, 0.7)', // Blue
      'rgba(34, 197, 94, 0.7)',  // Green
      'rgba(245, 158, 11, 0.7)', // Yellow
      'rgba(239, 68, 68, 0.7)',  // Red
      'rgba(139, 92, 246, 0.7)', // Purple
      'rgba(14, 165, 233, 0.7)', // Light Blue
      'rgba(249, 115, 22, 0.7)', // Orange
      'rgba(16, 185, 129, 0.7)'  // Teal
    ];
    
    // Count by payment method
    const paymentCounts = {
      cash: 0,
      pos: 0,
      none: 0
    };
    
    completedJobs.forEach(job => {
      paymentCounts[job.payment_method as keyof typeof paymentCounts]++;
    });
    
    // Create chart data
    const jobTypeData = {
      labels: jobTypeLabels,
      datasets: [
        {
          data: jobTypeValues,
          backgroundColor: colors.slice(0, jobTypeLabels.length),
          borderColor: colors.map(color => color.replace('0.7', '1')),
          borderWidth: 1
        }
      ]
    };
    
    const paymentMethodData = {
      labels: ['Cash', 'POS', 'No Payment'],
      datasets: [
        {
          data: [paymentCounts.cash, paymentCounts.pos, paymentCounts.none],
          backgroundColor: [
            'rgba(34, 197, 94, 0.7)',  // Green for Cash
            'rgba(59, 130, 246, 0.7)', // Blue for POS
            'rgba(156, 163, 175, 0.7)' // Gray for None
          ],
          borderColor: [
            'rgba(34, 197, 94, 1)', 
            'rgba(59, 130, 246, 1)', 
            'rgba(156, 163, 175, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
    
    return { jobTypeData, paymentMethodData };
  }, [jobCards]);
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12
        }
      }
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <PieChart data={jobTypeData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment Method Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <PieChart data={paymentMethodData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobCardDistributionChart;
