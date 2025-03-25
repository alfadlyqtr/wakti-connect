
import React from 'react';
import { Button } from '@/components/ui/button';
import { useJobCards } from '@/hooks/useJobCards';
import { Loader2, PlusCircle } from 'lucide-react';
import ActiveJobCard from './ActiveJobCard';
import CompletedJobsSection from './CompletedJobsSection';
import EmptyJobCards from './EmptyJobCards';

interface JobCardsListProps {
  staffRelationId: string;
  onCreateJobCard: () => void;
  canCreateCard: boolean;
}

const JobCardsList: React.FC<JobCardsListProps> = ({ 
  staffRelationId, 
  onCreateJobCard,
  canCreateCard
}) => {
  const { 
    activeJobCards, 
    completedJobCards, 
    isLoading, 
    error, 
    completeJobCard 
  } = useJobCards(staffRelationId);
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading job cards...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4">
        <div className="text-sm font-medium text-destructive">
          Error loading job cards: {error.message}
        </div>
      </div>
    );
  }
  
  // Debug: Log job cards to verify their structure
  console.log("Active job cards:", activeJobCards);
  console.log("Completed job cards:", completedJobCards);
  
  if (activeJobCards.length === 0 && completedJobCards.length === 0) {
    return <EmptyJobCards onCreateJobCard={onCreateJobCard} canCreateCard={canCreateCard} />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          onClick={onCreateJobCard}
          disabled={!canCreateCard}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Job Card
        </Button>
      </div>
      
      {activeJobCards.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Active Jobs</h3>
          {activeJobCards.map(jobCard => (
            <ActiveJobCard
              key={jobCard.id}
              jobCard={jobCard}
              onComplete={() => completeJobCard.mutate(jobCard.id)}
              isCompleting={completeJobCard.isPending}
            />
          ))}
        </div>
      )}
      
      {completedJobCards.length > 0 && (
        <CompletedJobsSection completedJobs={completedJobCards} />
      )}
    </div>
  );
};

export default JobCardsList;
