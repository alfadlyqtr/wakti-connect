
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobCard } from '@/types/jobs.types';
import { format, parseISO, isThisWeek, isThisMonth, isThisYear } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface JobCardEarningsSummaryProps {
  jobCards: JobCard[];
  timeRange: string;
}

const JobCardEarningsSummary: React.FC<JobCardEarningsSummaryProps> = ({ 
  jobCards,
  timeRange
}) => {
  // Group job cards by date
  const jobsByDate = jobCards.reduce((acc, job) => {
    if (!job.end_time) return acc; // Skip active jobs
    
    const dateKey = format(new Date(job.start_time), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        jobs: [],
        totalEarnings: 0,
        cashTotal: 0,
        posTotal: 0,
      };
    }
    
    acc[dateKey].jobs.push(job);
    acc[dateKey].totalEarnings += job.payment_amount;
    
    if (job.payment_method === 'cash') {
      acc[dateKey].cashTotal += job.payment_amount;
    } else if (job.payment_method === 'pos') {
      acc[dateKey].posTotal += job.payment_amount;
    }
    
    return acc;
  }, {} as Record<string, {
    date: string;
    jobs: JobCard[];
    totalEarnings: number;
    cashTotal: number;
    posTotal: number;
  }>);
  
  // Convert to array and sort by date (most recent first)
  const sortedDays = Object.values(jobsByDate).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Calculate aggregated totals
  const grandTotal = sortedDays.reduce((sum, day) => sum + day.totalEarnings, 0);
  const cashGrandTotal = sortedDays.reduce((sum, day) => sum + day.cashTotal, 0);
  const posGrandTotal = sortedDays.reduce((sum, day) => sum + day.posTotal, 0);
  
  if (sortedDays.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Earnings Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No completed jobs found for the selected time period.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Jobs</TableHead>
              <TableHead className="text-right">Cash</TableHead>
              <TableHead className="text-right">POS</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDays.map(day => {
              const date = parseISO(day.date);
              let badgeVariant: "default" | "destructive" | "outline" | "secondary" | "success" | "warning" = "outline";
              
              // Highlight based on date
              if (isThisWeek(date)) {
                badgeVariant = "default";
              }
              
              return (
                <TableRow key={day.date}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{format(date, 'MMM dd, yyyy')}</span>
                      {isThisWeek(date) && (
                        <Badge variant={badgeVariant} className="text-xs">
                          {format(date, 'EEEE')}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{day.jobs.length}</TableCell>
                  <TableCell className="text-right">${day.cashTotal.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${day.posTotal.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">${day.totalEarnings.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <tfoot>
            <TableRow className="bg-muted/50">
              <TableCell colSpan={2} className="font-medium">Totals</TableCell>
              <TableCell className="text-right font-medium">${cashGrandTotal.toFixed(2)}</TableCell>
              <TableCell className="text-right font-medium">${posGrandTotal.toFixed(2)}</TableCell>
              <TableCell className="text-right font-bold">${grandTotal.toFixed(2)}</TableCell>
            </TableRow>
          </tfoot>
        </Table>
      </CardContent>
    </Card>
  );
};

export default JobCardEarningsSummary;
