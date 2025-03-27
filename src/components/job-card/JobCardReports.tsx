
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJobCardsForReports } from '@/hooks/useJobCardsForReports';
import { Loader2, Download, Calendar, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { format, subDays, startOfMonth, startOfWeek } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { exportToCSV } from '@/utils/exportUtils';
import {
  JobCardEarningsSummary,
  JobCardStatistics,
  JobCardPerformanceChart,
  JobCardDistributionChart,
  StaffPerformanceTable
} from './reports';

type TimeRange = 'week' | 'month' | 'quarter' | 'year';

interface JobCardReportsProps {
  staffRelationId: string;
  isBusinessAccount?: boolean;
}

const JobCardReports: React.FC<JobCardReportsProps> = ({ 
  staffRelationId,
  isBusinessAccount = false
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [reportType, setReportType] = useState('earnings');
  
  const { jobCards, isLoading, error } = useJobCardsForReports(staffRelationId, timeRange);
  
  // Filter data based on selected time range
  const filteredData = useMemo(() => {
    if (!jobCards) return [];
    
    const now = new Date();
    let cutoffDate: Date;
    
    switch (timeRange) {
      case 'week':
        cutoffDate = startOfWeek(now);
        break;
      case 'month':
        cutoffDate = startOfMonth(now);
        break;
      case 'quarter':
        cutoffDate = subDays(now, 90);
        break;
      case 'year':
        cutoffDate = subDays(now, 365);
        break;
      default:
        cutoffDate = startOfMonth(now);
    }
    
    return jobCards.filter(card => 
      new Date(card.start_time) >= cutoffDate
    );
  }, [jobCards, timeRange]);
  
  // Calculate total metrics
  const totalEarnings = useMemo(() => {
    return filteredData.reduce((sum, card) => sum + card.payment_amount, 0);
  }, [filteredData]);
  
  const totalCompletedJobs = useMemo(() => {
    return filteredData.filter(card => card.end_time).length;
  }, [filteredData]);
  
  // Export report data
  const handleExportReport = () => {
    const reportData = filteredData.map(card => ({
      Date: format(new Date(card.start_time), 'yyyy-MM-dd'),
      Job: card.job?.name || 'Unknown Job',
      StartTime: format(new Date(card.start_time), 'HH:mm'),
      EndTime: card.end_time ? format(new Date(card.end_time), 'HH:mm') : 'In Progress',
      PaymentMethod: card.payment_method.toUpperCase(),
      Amount: card.payment_amount,
      Status: card.end_time ? 'Completed' : 'Active',
      Staff: card.staff_name || 'Unknown'
    }));
    
    exportToCSV(reportData, `job-cards-report-${timeRange}-${format(new Date(), 'yyyy-MM-dd')}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading report data...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-destructive">
            Error loading report data: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Job Card Reports</h2>
          <p className="text-muted-foreground">
            Analyze your work performance and earnings
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Summary metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <h3 className="text-2xl font-bold">{totalCompletedJobs}</h3>
              </div>
              <Badge variant="outline" className="flex items-center gap-1 py-1.5">
                <Clock className="h-4 w-4" />
                {timeRange}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${totalEarnings.toFixed(2)}
                </h3>
              </div>
              <Badge variant="outline" className="flex items-center gap-1 py-1.5">
                <DollarSign className="h-4 w-4" />
                {timeRange}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Per Job</p>
                <h3 className="text-2xl font-bold">
                  ${totalCompletedJobs ? (totalEarnings / totalCompletedJobs).toFixed(2) : '0.00'}
                </h3>
              </div>
              <Badge variant="outline" className="flex items-center gap-1 py-1.5">
                <Clock className="h-4 w-4" />
                {timeRange}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Report types */}
      <Tabs value={reportType} onValueChange={setReportType} className="mt-6">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="earnings">Earnings Summary</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="distribution">Job Distribution</TabsTrigger>
          {isBusinessAccount && <TabsTrigger value="staff">Staff Performance</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="earnings" className="mt-6">
          <JobCardEarningsSummary jobCards={filteredData} timeRange={timeRange} />
        </TabsContent>
        
        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <JobCardStatistics jobCards={filteredData} timeRange={timeRange} />
            <JobCardPerformanceChart jobCards={filteredData} timeRange={timeRange} />
          </div>
        </TabsContent>
        
        <TabsContent value="distribution" className="mt-6">
          <JobCardDistributionChart jobCards={filteredData} timeRange={timeRange} />
        </TabsContent>
        
        {isBusinessAccount && (
          <TabsContent value="staff" className="mt-6">
            <StaffPerformanceTable jobCards={filteredData} timeRange={timeRange} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default JobCardReports;
