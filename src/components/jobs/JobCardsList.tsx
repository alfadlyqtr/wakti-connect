
import React, { useState } from "react";
import { useJobCards } from "@/hooks/jobs";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FilterPeriod } from "./jobCardUtils";
import EmptyJobCards from "./EmptyJobCards";
import ActiveJobsSection from "./ActiveJobsSection";
import CompletedJobsSection from "./CompletedJobsSection";

interface JobCardsListProps {
  staffRelationId: string;
}

const JobCardsList: React.FC<JobCardsListProps> = ({ staffRelationId }) => {
  const { toast } = useToast();
  const { jobCards, isLoading, refetch } = useJobCards(staffRelationId);
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("all");
  
  const handleCompleteJob = async (jobCardId: string) => {
    try {
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
      setTimeout(() => {
        refetch();
      }, 500);
      
      toast({
        title: "Job completed",
        description: "Job has been marked as completed successfully",
      });
    } catch (error) {
      console.error("Error completing job:", error);
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
    return <EmptyJobCards />;
  }
  
  // Separate active and completed job cards
  const activeJobCards = jobCards.filter(card => !card.end_time) || [];
  const completedJobCards = jobCards.filter(card => card.end_time) || [];
  
  return (
    <div className="space-y-6">
      {activeJobCards.length > 0 && (
        <ActiveJobsSection 
          activeJobs={activeJobCards}
          onCompleteJob={handleCompleteJob}
        />
      )}
      
      {completedJobCards.length > 0 && (
        <CompletedJobsSection 
          completedJobs={completedJobCards}
          filterPeriod={filterPeriod}
          setFilterPeriod={setFilterPeriod}
        />
      )}
    </div>
  );
};

export default JobCardsList;
