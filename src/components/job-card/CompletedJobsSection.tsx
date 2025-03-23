
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { JobCard } from '@/types/job.types';
import { formatCurrency, formatDuration } from '@/utils/formatUtils';

type FilterPeriod = 'all' | 'today' | 'this-week' | 'this-month';

interface CompletedJobsSectionProps {
  completedJobs: JobCard[];
}

const CompletedJobsSection: React.FC<CompletedJobsSectionProps> = ({ 
  completedJobs 
}) => {
  const [period, setPeriod] = useState<FilterPeriod>('all');
  
  // Filter jobs based on period
  const filteredJobs = completedJobs.filter(job => {
    const date = new Date(job.end_time!);
    switch (period) {
      case 'today': return isToday(date);
      case 'this-week': return isThisWeek(date);
      case 'this-month': return isThisMonth(date);
      default: return true;
    }
  });
  
  // Group jobs by date
  const jobsByDate: Record<string, JobCard[]> = {};
  filteredJobs.forEach(job => {
    const dateStr = format(new Date(job.end_time!), 'yyyy-MM-dd');
    if (!jobsByDate[dateStr]) {
      jobsByDate[dateStr] = [];
    }
    jobsByDate[dateStr].push(job);
  });
  
  // Calculate total earnings
  const totalEarnings = filteredJobs.reduce((sum, job) => {
    return job.payment_method !== 'none' ? sum + job.payment_amount : sum;
  }, 0);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Completed Jobs</CardTitle>
        <Select value={period} onValueChange={(value) => setPeriod(value as FilterPeriod)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <Badge variant="outline" className="px-3 py-1">
            {filteredJobs.length} jobs
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            Total: {formatCurrency(totalEarnings)}
          </Badge>
        </div>
        
        {filteredJobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No completed jobs found for this period.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(jobsByDate).map(([dateStr, jobs]) => (
                <React.Fragment key={dateStr}>
                  <TableRow className="bg-muted/30">
                    <TableCell colSpan={5}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {format(new Date(dateStr), "EEEE, MMMM d, yyyy")}
                        </span>
                        <Badge variant="outline">
                          {jobs.length} jobs
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                  {jobs.map(job => {
                    // Calculate duration
                    let duration = "N/A";
                    if (job.end_time && job.start_time) {
                      const start = new Date(job.start_time);
                      const end = new Date(job.end_time);
                      duration = formatDuration(start, end);
                    }
                    
                    return (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">
                          {job.job?.name || "Unknown Job"}
                        </TableCell>
                        <TableCell>{format(new Date(job.start_time), "h:mm a")}</TableCell>
                        <TableCell>{duration}</TableCell>
                        <TableCell>
                          {job.payment_method === 'none' 
                            ? "No payment" 
                            : `${formatCurrency(job.payment_amount)} (${job.payment_method.toUpperCase()})`}
                        </TableCell>
                        <TableCell>
                          <div className="inline-flex items-center px-2.5 py-1 rounded-md 
                                      bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300
                                      border border-green-300 dark:border-green-800 text-xs">
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            COMPLETED
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CompletedJobsSection;
