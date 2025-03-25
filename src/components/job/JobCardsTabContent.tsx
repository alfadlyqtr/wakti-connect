
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import JobCardsList from '@/components/job-card/JobCardsList';
import CreateJobCardDialog from '@/components/job-card/CreateJobCardDialog';
import { Loader2 } from 'lucide-react';

interface JobCardsTabContentProps {
  onCreateJobCard: () => void;
  isCreateJobCardOpen: boolean;
  setIsCreateJobCardOpen: (open: boolean) => void;
}

const JobCardsTabContent: React.FC<JobCardsTabContentProps> = ({
  onCreateJobCard,
  isCreateJobCardOpen,
  setIsCreateJobCardOpen
}) => {
  const [staffRelationId, setStaffRelationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const getStaffId = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setStaffRelationId(session.user.id);
        }
      } catch (error) {
        console.error("Error getting user ID:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getStaffId();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
  
  return (
    <>
      {staffRelationId && (
        <JobCardsList 
          staffRelationId={staffRelationId}
          onCreateJobCard={onCreateJobCard}
          canCreateCard={true}
        />
      )}
      
      {staffRelationId && (
        <CreateJobCardDialog
          open={isCreateJobCardOpen}
          onOpenChange={setIsCreateJobCardOpen}
          staffRelationId={staffRelationId}
          isBusinessOwner={true}
        />
      )}
    </>
  );
};

export default JobCardsTabContent;
