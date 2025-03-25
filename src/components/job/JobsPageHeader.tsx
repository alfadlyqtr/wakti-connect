
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface JobsPageHeaderProps {
  activeTab: string;
  onCreateJob: () => void;
  onCreateJobCard: () => void;
}

const JobsPageHeader: React.FC<JobsPageHeaderProps> = ({ 
  activeTab, 
  onCreateJob, 
  onCreateJobCard 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold mb-1">Jobs Management</h1>
        <p className="text-muted-foreground">
          Manage jobs that you or your staff can complete
        </p>
      </div>
      
      {activeTab === "jobs" ? (
        <Button onClick={onCreateJob}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Job
        </Button>
      ) : (
        <Button onClick={onCreateJobCard}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Job Card
        </Button>
      )}
    </div>
  );
};

export default JobsPageHeader;
