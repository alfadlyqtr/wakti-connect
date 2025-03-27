
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { JobCard } from '@/types/jobs.types';
import { differenceInMinutes } from 'date-fns';

interface StaffPerformanceTableProps {
  jobCards: JobCard[];
  timeRange: string;
}

const StaffPerformanceTable: React.FC<StaffPerformanceTableProps> = ({
  jobCards,
  timeRange
}) => {
  // Calculate staff performance metrics
  const staffMetrics = useMemo(() => {
    const staffMap: Record<string, {
      name: string;
      jobCount: number;
      earnings: number;
      workTimeMinutes: number;
    }> = {};
    
    // Filter completed jobs
    const completedJobs = jobCards.filter(job => job.end_time);
    
    completedJobs.forEach(job => {
      const staffName = job.staff_name || 'Unknown Staff';
      
      if (!staffMap[staffName]) {
        staffMap[staffName] = {
          name: staffName,
          jobCount: 0,
          earnings: 0,
          workTimeMinutes: 0
        };
      }
      
      // Update counts
      staffMap[staffName].jobCount++;
      staffMap[staffName].earnings += job.payment_amount;
      
      // Calculate job duration
      if (job.end_time) {
        const start = new Date(job.start_time);
        const end = new Date(job.end_time);
        staffMap[staffName].workTimeMinutes += differenceInMinutes(end, start);
      }
    });
    
    // Convert to array and sort by earnings (highest first)
    return Object.values(staffMap).sort((a, b) => b.earnings - a.earnings);
  }, [jobCards]);
  
  // Format work time for display
  const formatWorkTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  if (staffMetrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staff Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No staff performance data available for the selected period.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead className="text-right">Jobs</TableHead>
              <TableHead className="text-right">Work Time</TableHead>
              <TableHead className="text-right">Earnings</TableHead>
              <TableHead className="text-right">Avg Per Job</TableHead>
              <TableHead className="text-right">Avg Per Hour</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffMetrics.map((staff, index) => {
              const avgPerJob = staff.jobCount > 0 
                ? staff.earnings / staff.jobCount 
                : 0;
                
              const workHours = staff.workTimeMinutes / 60;
              const avgPerHour = workHours > 0 
                ? staff.earnings / workHours 
                : 0;
              
              return (
                <TableRow key={staff.name}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{staff.name}</span>
                      {index === 0 && (
                        <Badge variant="default" className="text-xs">Top Earner</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{staff.jobCount}</TableCell>
                  <TableCell className="text-right">{formatWorkTime(staff.workTimeMinutes)}</TableCell>
                  <TableCell className="text-right font-medium">${staff.earnings.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${avgPerJob.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${avgPerHour.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StaffPerformanceTable;
