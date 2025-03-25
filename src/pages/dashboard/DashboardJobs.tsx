
import React from 'react';
import JobsPage from '@/components/job/JobsPage';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

const DashboardJobs = () => {
  return (
    <ErrorBoundary>
      <JobsPage />
    </ErrorBoundary>
  );
};

export default DashboardJobs;
