
import React, { useState } from "react";
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
import { formatDateTime } from "@/utils/dateUtils";
import { formatCurrency, formatDuration } from "@/utils/formatUtils";
import { FileText, Loader2 } from "lucide-react";
import ActiveJobCard from "./ActiveJobCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface JobCardsListProps {
  staffRelationId: string;
}

const JobCardsList: React.FC<JobCardsListProps> = ({ staffRelationId }) => {
  const { toast } = useToast();
  const { jobCards, isLoading, refetch } = useJobCards(staffRelationId);
  const [completingJobId, setCompletingJobId] = useState<string | null>(null);
  
  const activeJobCards = jobCards?.filter(card => !card.end_time) || [];
  const completedJobCards = jobCards?.filter(card => card.end_time) || [];
  
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
      
      {completedJobCards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent>
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
                {completedJobCards.map(jobCard => {
                  // Calculate duration
                  let duration = "N/A";
                  if (jobCard.end_time) {
                    const start = new Date(jobCard.start_time);
                    const end = new Date(jobCard.end_time);
                    duration = formatDuration(start, end);
                  }
                  
                  return (
                    <TableRow key={jobCard.id}>
                      <TableCell className="font-medium">
                        {jobCard.job?.name || "Unknown Job"}
                      </TableCell>
                      <TableCell>{formatDateTime(jobCard.start_time)}</TableCell>
                      <TableCell>{duration}</TableCell>
                      <TableCell>
                        {jobCard.payment_method === 'none' 
                          ? "No payment" 
                          : `${formatCurrency(jobCard.payment_amount)} (${jobCard.payment_method.toUpperCase()})`}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobCardsList;
