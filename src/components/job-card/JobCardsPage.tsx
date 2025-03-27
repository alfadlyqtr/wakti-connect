
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStaffStatus } from '@/hooks/useStaffStatus';
import WorkStatusCard from './WorkStatusCard';
import JobCardsList from './JobCardsList';
import WorkHistory from './WorkHistory';
import CreateJobCardDialog from './CreateJobCardDialog';
import StaffStatusMessage from './StaffStatusMessage';
import { Loader2 } from 'lucide-react';
import { isBusinessOwner } from '@/utils/jobsUtils';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';
import { PlusCircle, BarChart2, Filter } from 'lucide-react';
import JobCardReports from './JobCardReports';

const JobCardsPage: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isBusinessAccount, setIsBusinessAccount] = useState(false);
  const [isCheckingBusinessStatus, setIsCheckingBusinessStatus] = useState(true);
  const [activeTab, setActiveTab] = useState("job-cards");
  
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
  
  // Check if the user is a business owner
  useEffect(() => {
    const checkBusinessStatus = async () => {
      try {
        setIsCheckingBusinessStatus(true);
        const businessOwner = await isBusinessOwner();
        setIsBusinessAccount(businessOwner);
      } catch (error) {
        console.error("Error checking business status:", error);
      } finally {
        setIsCheckingBusinessStatus(false);
      }
    };
    
    checkBusinessStatus();
  }, []);
  
  if (isLoading || isCheckingBusinessStatus) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading information...</span>
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
  
  // If user is neither staff nor business owner, show the staff status message
  if (!isStaff && !isBusinessAccount) {
    return <StaffStatusMessage />;
  }
  
  return (
    <CurrencyProvider>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Job Cards</h1>
            <p className="text-muted-foreground">
              Record completed jobs and track your daily earnings
            </p>
          </div>
          
          {/* Show create button for business owners */}
          {isBusinessAccount && (
            <Button onClick={() => setIsCreateOpen(true)} className="mt-4 sm:mt-0">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Job Card
            </Button>
          )}
        </div>
        
        {/* Only show work status card for staff, not for business owners */}
        {isStaff && !isBusinessAccount && (
          <WorkStatusCard 
            activeWorkSession={activeWorkSession}
            onStartWorkDay={startWorkSession}
            onEndWorkDay={endWorkSession}
            onCreateJobCard={() => setIsCreateOpen(true)}
            isStarting={isStartingSession}
            isEnding={isEndingSession}
          />
        )}
        
        <Tabs defaultValue="job-cards" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="job-cards">Job Cards</TabsTrigger>
            <TabsTrigger value="work-history">Work History</TabsTrigger>
            <TabsTrigger value="reports">
              <span className="flex items-center">
                <BarChart2 className="h-4 w-4 mr-2" />
                Reports
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="job-cards" className="mt-6">
            {staffRelationId && (
              <JobCardsList 
                staffRelationId={staffRelationId}
                onCreateJobCard={() => setIsCreateOpen(true)}
                canCreateCard={!!activeWorkSession || isBusinessAccount}
                isBusinessAccount={isBusinessAccount}
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
          
          <TabsContent value="reports" className="mt-6">
            {staffRelationId && (
              <JobCardReports
                staffRelationId={staffRelationId}
                isBusinessAccount={isBusinessAccount}
              />
            )}
          </TabsContent>
        </Tabs>
        
        {staffRelationId && (
          <CreateJobCardDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            staffRelationId={staffRelationId}
            isBusinessOwner={isBusinessAccount}
          />
        )}
      </div>
    </CurrencyProvider>
  );
};

export default JobCardsPage;
