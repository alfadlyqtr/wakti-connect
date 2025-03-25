
import React, { useState } from 'react';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JobsTabContent from './JobsTabContent';
import JobCardsTabContent from './JobCardsTabContent';
import useBusinessOwnerStatus from '@/hooks/useBusinessOwnerStatus';
import JobsPageHeader from './JobsPageHeader';

const JobsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const { isBusinessAccount, isCheckingBusinessStatus } = useBusinessOwnerStatus();
  const [isCreateJobCardOpen, setIsCreateJobCardOpen] = useState(false);
  
  return (
    <CurrencyProvider>
      <div className="space-y-6">
        <JobsPageHeader 
          activeTab={activeTab}
          onCreateJob={() => setCreateDialogOpen(true)} 
          onCreateJobCard={() => setIsCreateJobCardOpen(true)}
        />
        
        {isBusinessAccount && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="job-cards">Job Cards</TabsTrigger>
            </TabsList>
            
            <TabsContent value="jobs" className="mt-0">
              <JobsTabContent />
            </TabsContent>
            
            <TabsContent value="job-cards" className="mt-0">
              <JobCardsTabContent 
                onCreateJobCard={() => setIsCreateJobCardOpen(true)}
                isCreateJobCardOpen={isCreateJobCardOpen}
                setIsCreateJobCardOpen={setIsCreateJobCardOpen}
              />
            </TabsContent>
          </Tabs>
        )}
        
        {!isBusinessAccount && <JobsTabContent />}
      </div>
    </CurrencyProvider>
  );
};

export default JobsPage;
