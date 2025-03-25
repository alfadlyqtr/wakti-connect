
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatTime } from '@/utils/formatUtils';
import { JobCard } from '@/types/jobs.types';
import { format } from 'date-fns';
import { Check, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CompletedJobsSectionProps {
  completedJobs: JobCard[];
}

const CompletedJobsSection: React.FC<CompletedJobsSectionProps> = ({ completedJobs }) => {
  const [timeFilter, setTimeFilter] = useState<string>("today");
  
  // Calculate start date for filtering
  const getFilterDate = (): Date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (timeFilter) {
      case "week":
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        return lastWeek;
      case "month":
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        return lastMonth;
      case "today":
      default:
        return today;
    }
  };
  
  // Filter jobs based on selected timeframe
  const filteredJobs = completedJobs.filter(job => {
    const filterDate = getFilterDate();
    const jobDate = new Date(job.end_time as string);
    return jobDate >= filterDate;
  });
  
  // Log completed jobs data to debug
  console.log("Completed jobs data:", completedJobs);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h3 className="text-lg font-medium">Completed Jobs</h3>
        <Select
          value={timeFilter}
          onValueChange={(value) => setTimeFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              No completed jobs found for the selected period
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map(job => (
            <Card key={job.id} className="overflow-hidden border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="mb-2 sm:mb-0">
                    <h4 className="font-medium flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-1" />
                      {job.job?.name || "Job"}
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedJobsSection;
