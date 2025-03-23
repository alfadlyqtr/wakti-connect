
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStaffStatus } from '@/hooks/useStaffStatus';
import WorkStatusCard from './WorkStatusCard';
import JobCardsList from './JobCardsList';
import WorkHistory from './WorkHistory';
import CreateJobCardDialog from './CreateJobCardDialog';
import StaffStatusMessage from './StaffStatusMessage';
import { Loader2 } from 'lucide-react';

const JobCardsPage: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { 
    isStaff, 
    staffRelationId, 
    activeWorkSession, 
    isLoading, 
    error,
    startWorkSession,
    endWorkSession,
    isStartingSession,
    isEndingSession
  } = useStaffStatus();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading staff information...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4">
        <div className="text-sm font-medium text-destructive">
          Error: {error.message}
        </div>
      </div>
    );
  }
  
  if (!isStaff) {
    return <StaffStatusMessage />;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Job Cards</h1>
        <p className="text-muted-foreground">
          Record completed jobs and track your daily earnings
        </p>
      </div>
      
      <WorkStatusCard 
        activeWorkSession={activeWorkSession}
        onStartWorkDay={startWorkSession}
        onEndWorkDay={endWorkSession}
        onCreateJobCard={() => setIsCreateOpen(true)}
        isStarting={isStartingSession}
        isEnding={isEndingSession}
      />
      
      <Tabs defaultValue="job-cards">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="job-cards">Job Cards</TabsTrigger>
          <TabsTrigger value="work-history">Work History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="job-cards" className="mt-6">
          {staffRelationId && (
            <JobCardsList 
              staffRelationId={staffRelationId}
              onCreateJobCard={() => setIsCreateOpen(true)}
              canCreateCard={!!activeWorkSession}
            />
          )}
        </TabsContent>
        
        <TabsContent value="work-history" className="mt-6">
          {staffRelationId && (
            <WorkHistory
              staffRelationId={staffRelationId}
              activeWorkSession={activeWorkSession}
            />
          )}
        </TabsContent>
      </Tabs>
      
      {staffRelationId && (
        <CreateJobCardDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          staffRelationId={staffRelationId}
        />
      )}
    </div>
  );
};

export default JobCardsPage;
