
import React, { useState, useEffect } from "react";
import { useJobCards } from "@/hooks/useJobCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { formatDateTime } from "@/utils/dateUtils";
import { formatCurrency, formatDuration } from "@/utils/formatUtils";
import { FileText, Loader2, Filter, Calendar, CheckSquare } from "lucide-react";
import ActiveJobCard from "./ActiveJobCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, isToday, isThisWeek, isThisMonth, parseISO, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface JobCardsListProps {
  staffRelationId: string;
}

type FilterPeriod = "all" | "today" | "thisWeek" | "thisMonth";

const JobCardsList: React.FC<JobCardsListProps> = ({ staffRelationId }) => {
  const { toast } = useToast();
  const { jobCards, isLoading, refetch } = useJobCards(staffRelationId);
  const [completingJobId, setCompletingJobId] = useState<string | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("all");
  
  // Filter job cards based on selected period
  const filterJobCards = (cards: any[] = [], period: FilterPeriod) => {
    if (period === "all") return cards;
    
    return cards.filter(card => {
      const date = parseISO(card.start_time);
      switch (period) {
        case "today": return isToday(date);
        case "thisWeek": return isThisWeek(date);
        case "thisMonth": return isThisMonth(date);
        default: return true;
      }
    });
  };
  
  const activeJobCards = jobCards?.filter(card => !card.end_time) || [];
  const filteredCompletedJobCards = filterJobCards(
    jobCards?.filter(card => card.end_time) || [], 
    filterPeriod
  );
  
  // Count jobs by date
  const getJobCountByDate = () => {
    const counts: Record<string, number> = {};
    
    filteredCompletedJobCards.forEach(card => {
      const dateStr = format(new Date(card.start_time), "yyyy-MM-dd");
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });
    
    return counts;
  };
  
  const jobCountByDate = getJobCountByDate();
  
  // Calculate total duration for filtered completed jobs
  const getTotalDuration = () => {
    let totalMinutes = 0;
    
    filteredCompletedJobCards.forEach(card => {
      if (card.end_time) {
        const start = new Date(card.start_time);
        const end = new Date(card.end_time);
        const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
        totalMinutes += diffMinutes;
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };
  
  const handleCompleteJob = async (jobCardId: string) => {
    try {
      setCompletingJobId(jobCardId);
      
      // Update the job card with the end time
      const { data, error } = await supabase
        .from('job_cards')
        .update({
          end_time: new Date().toISOString()
        })
        .eq('id', jobCardId)
        .select();
        
      if (error) {
        toast({
          title: "Error",
          description: "Failed to complete job: " + error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      // Refetch job cards to update the list
      refetch();
      
      toast({
        title: "Job completed",
        description: "Job has been marked as completed successfully",
      });
    } catch (error) {
      console.error("Error completing job:", error);
    } finally {
      setCompletingJobId(null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading job cards...</span>
      </div>
    );
  }
  
  if (!jobCards || jobCards.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Job Cards Yet</h3>
          <p className="text-muted-foreground">
            Start a work session and create your first job card.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {activeJobCards.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Active Jobs</h3>
          {activeJobCards.map(jobCard => (
            <ActiveJobCard
              key={jobCard.id}
              jobCard={jobCard}
              onCompleteJob={handleCompleteJob}
              isCompleting={completingJobId === jobCard.id}
            />
          ))}
        </div>
      )}
      
      {filteredCompletedJobCards.length > 0 || jobCards?.some(card => card.end_time) ? (
        <Card>
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Completed Jobs</CardTitle>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterPeriod} onValueChange={(value) => setFilterPeriod(value as FilterPeriod)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filter period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="thisWeek">This week</SelectItem>
                    <SelectItem value="thisMonth">This month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {filteredCompletedJobCards.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckSquare className="h-3 w-3" />
                    <span>Jobs: {filteredCompletedJobCards.length}</span>
                  </Badge>
                  
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Total time: {getTotalDuration()}</span>
                  </Badge>
                  
                  {filterPeriod === "today" && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Today: {format(new Date(), "MMM d, yyyy")}</span>
                    </Badge>
                  )}
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompletedJobCards.map(jobCard => {
                      // Calculate duration
                      let duration = "N/A";
                      if (jobCard.end_time) {
                        const start = new Date(jobCard.start_time);
                        const end = new Date(jobCard.end_time);
                        duration = formatDuration(start, end);
                      }
                      
                      // Group by date
                      const dateStr = format(new Date(jobCard.start_time), "yyyy-MM-dd");
                      const isFirstInGroup = filteredCompletedJobCards.findIndex(
                        card => format(new Date(card.start_time), "yyyy-MM-dd") === dateStr
                      ) === filteredCompletedJobCards.indexOf(jobCard);
                      
                      return (
                        <React.Fragment key={jobCard.id}>
                          {isFirstInGroup && (
                            <TableRow className="bg-muted/30">
                              <TableCell colSpan={4}>
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">
                                    {format(new Date(jobCard.start_time), "EEEE, MMMM d, yyyy")}
                                  </span>
                                  <Badge variant="outline">
                                    {jobCountByDate[dateStr]} jobs
                                  </Badge>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                          <TableRow>
                            <TableCell className="font-medium">
                              {jobCard.job?.name || "Unknown Job"}
                            </TableCell>
                            <TableCell>{format(new Date(jobCard.start_time), "h:mm a")}</TableCell>
                            <TableCell>{duration}</TableCell>
                            <TableCell>
                              {jobCard.payment_method === 'none' 
                                ? "No payment" 
                                : `${formatCurrency(jobCard.payment_amount)} (${jobCard.payment_method.toUpperCase()})`}
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No completed jobs found for the selected period.</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default JobCardsList;
