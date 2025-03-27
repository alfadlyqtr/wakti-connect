
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatTime } from '@/utils/formatUtils';
import { JobCard } from '@/types/jobs.types';
import { format, isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';
import { Check, Clock, Download, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/utils/exportUtils';

interface CompletedJobsSectionProps {
  completedJobs: JobCard[];
  filterPeriod: 'all' | 'today' | 'thisWeek' | 'thisMonth';
  paymentFilter: 'all' | 'cash' | 'pos' | 'none';
  sortOption: 'newest' | 'oldest' | 'highest-amount' | 'lowest-amount';
  isBusinessView?: boolean;
}

const CompletedJobsSection: React.FC<CompletedJobsSectionProps> = ({ 
  completedJobs,
  filterPeriod,
  paymentFilter,
  sortOption,
  isBusinessView = false
}) => {
  const filteredAndSortedJobs = useMemo(() => {
    // First apply time filter
    let filtered = completedJobs;
    if (filterPeriod !== 'all') {
      filtered = completedJobs.filter(job => {
        const date = parseISO(job.end_time as string);
        switch (filterPeriod) {
          case 'today': return isToday(date);
          case 'thisWeek': return isThisWeek(date);
          case 'thisMonth': return isThisMonth(date);
          default: return true;
        }
      });
    }
    
    // Then apply payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(job => job.payment_method === paymentFilter);
    }
    
    // Finally sort the filtered results
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'oldest': 
          return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
        case 'highest-amount': 
          return b.payment_amount - a.payment_amount;
        case 'lowest-amount': 
          return a.payment_amount - b.payment_amount;
        case 'newest':
        default: 
          return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
      }
    });
  }, [completedJobs, filterPeriod, paymentFilter, sortOption]);
  
  // Calculate totals
  const totalEarnings = useMemo(() => {
    return filteredAndSortedJobs.reduce((sum, job) => sum + job.payment_amount, 0);
  }, [filteredAndSortedJobs]);
  
  // Count by payment method
  const paymentMethodCounts = useMemo(() => {
    return filteredAndSortedJobs.reduce((counts, job) => {
      counts[job.payment_method] = (counts[job.payment_method] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }, [filteredAndSortedJobs]);
  
  const handleExportData = () => {
    const data = filteredAndSortedJobs.map(job => ({
      Job: job.job?.name || 'Unknown Job',
      Date: format(new Date(job.start_time), 'yyyy-MM-dd'),
      StartTime: format(new Date(job.start_time), 'HH:mm'),
      EndTime: job.end_time ? format(new Date(job.end_time), 'HH:mm') : 'In Progress',
      PaymentMethod: job.payment_method.toUpperCase(),
      Amount: job.payment_amount,
      Notes: job.notes || ''
    }));
    
    exportToCSV(data, `job-cards-export-${format(new Date(), 'yyyy-MM-dd')}`);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h3 className="text-lg font-medium">Completed Jobs</h3>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportData}
          className="mt-2 sm:mt-0"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
      
      {/* Summary cards for quick metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-2">Total Jobs</div>
            <div className="text-2xl font-bold">{filteredAndSortedJobs.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-2">Total Earnings</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalEarnings)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-2">Cash Payments</div>
            <div className="text-2xl font-bold">{paymentMethodCounts['cash'] || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-2">POS Payments</div>
            <div className="text-2xl font-bold">{paymentMethodCounts['pos'] || 0}</div>
          </CardContent>
        </Card>
      </div>
      
      {filteredAndSortedJobs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              No completed jobs found for the selected filters
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedJobs.map(job => (
            <Card key={job.id} className="overflow-hidden border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="mb-2 sm:mb-0">
                    <h4 className="font-medium flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-1" />
                      {job.job?.name || job.job_id || "Completed Job"}
                    </h4>
                    <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                      <span>
                        {job.end_time ? format(new Date(job.end_time), "MMM d, h:mm a") : ""}
                      </span>
                      {job.payment_method !== 'none' && (
                        <>
                          <span>•</span>
                          <Badge variant="outline" className="capitalize">
                            {job.payment_method}
                          </Badge>
                          <span>•</span>
                          <span>{formatCurrency(job.payment_amount)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 sm:mt-0 ml-0 sm:ml-auto">
                    <div className="flex items-center text-sm">
                      <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span>
                        {job.start_time && job.end_time && (
                          `${formatTime(job.start_time)} - ${formatTime(job.end_time)}`
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                {job.notes && (
                  <div className="mt-2 text-sm text-muted-foreground border-t pt-2">
                    {job.notes}
                  </div>
                )}
                
                {/* Show staff name for business view */}
                {isBusinessView && job.staff_name && (
                  <div className="mt-2 text-xs text-right">
                    <Badge variant="secondary">Staff: {job.staff_name}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedJobsSection;
