
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobCard } from '@/types/jobs.types';
import { 
  differenceInMinutes, 
  differenceInHours, 
  format, 
  parseISO,
  isToday,
  isThisWeek,
  isThisMonth
} from 'date-fns';

interface JobCardStatisticsProps {
  jobCards: JobCard[];
  timeRange: string;
}

const JobCardStatistics: React.FC<JobCardStatisticsProps> = ({ 
  jobCards,
  timeRange
}) => {
  // Filter completed jobs
  const completedJobs = jobCards.filter(job => job.end_time);
  
  // Calculate total work time in minutes
  const totalWorkTimeMinutes = completedJobs.reduce((sum, job) => {
    if (!job.end_time) return sum;
    const start = new Date(job.start_time);
    const end = new Date(job.end_time);
    return sum + differenceInMinutes(end, start);
  }, 0);
  
  // Get total work hours
  const totalWorkHours = totalWorkTimeMinutes / 60;
  
  // Calculate average job duration in minutes
  const avgJobDurationMinutes = completedJobs.length > 0 
    ? totalWorkTimeMinutes / completedJobs.length 
    : 0;
  
  // Calculate average earnings per hour
  const totalEarnings = completedJobs.reduce((sum, job) => sum + job.payment_amount, 0);
  const avgEarningsPerHour = totalWorkHours > 0 
    ? totalEarnings / totalWorkHours
    : 0;
  
  // Count jobs by type
  const jobTypeCounts = completedJobs.reduce((counts, job) => {
    const jobName = job.job?.name || 'Unknown';
    counts[jobName] = (counts[jobName] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  // Sort job types by count
  const sortedJobTypes = Object.entries(jobTypeCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5); // Top 5 job types
  
  // Count jobs by day
  const jobsByDay = completedJobs.reduce((counts, job) => {
    const day = format(new Date(job.start_time), 'EEEE');
    counts[day] = (counts[day] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  // Format work time for display
  const formatWorkTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Total Jobs</h4>
              <p className="text-2xl font-bold">{completedJobs.length}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Total Earnings</h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${totalEarnings.toFixed(2)}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Work Time</h4>
              <p className="text-2xl font-bold">{formatWorkTime(totalWorkTimeMinutes)}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Avg. Per Hour</h4>
              <p className="text-2xl font-bold">${avgEarningsPerHour.toFixed(2)}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Top Job Types</h4>
            <ul className="space-y-2">
              {sortedJobTypes.map(([jobName, count]) => (
                <li key={jobName} className="flex justify-between items-center">
                  <span className="text-sm">{jobName}</span>
                  <span className="text-sm font-medium">{count} jobs</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Busiest Days</h4>
            <ul className="space-y-2">
              {Object.entries(jobsByDay)
                .sort(([, countA], [, countB]) => countB - countA)
                .map(([day, count]) => (
                  <li key={day} className="flex justify-between items-center">
                    <span className="text-sm">{day}</span>
                    <span className="text-sm font-medium">{count} jobs</span>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCardStatistics;
