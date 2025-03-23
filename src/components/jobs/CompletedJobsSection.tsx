
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { JobCard } from "@/types/jobs.types";
import { FilterPeriod, filterJobCards, getJobCountByDate, getTotalDuration, getTotalEarnings } from "./jobCardUtils";
import JobsFilterPeriod from "./JobsFilterPeriod";
import JobStatsBadges from "./JobStatsBadges";
import CompletedJobsTable from "./CompletedJobsTable";

interface CompletedJobsSectionProps {
  completedJobs: JobCard[];
  filterPeriod: FilterPeriod;
  setFilterPeriod: (period: FilterPeriod) => void;
}

const CompletedJobsSection: React.FC<CompletedJobsSectionProps> = ({
  completedJobs,
  filterPeriod,
  setFilterPeriod
}) => {
  // If there are no completed jobs at all, return null
  if (!completedJobs.length) {
    return null;
  }
  
  // Filter completed jobs based on selected period
  const filteredCompletedJobs = filterJobCards(completedJobs, filterPeriod);
  const jobCountByDate = getJobCountByDate(filteredCompletedJobs);
  const totalDuration = getTotalDuration(filteredCompletedJobs);
  const totalEarnings = getTotalEarnings(filteredCompletedJobs);

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Completed Jobs</CardTitle>
          <div className="mt-2 sm:mt-0">
            <JobsFilterPeriod 
              value={filterPeriod} 
              onChange={setFilterPeriod} 
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <JobStatsBadges 
          jobCount={filteredCompletedJobs.length}
          totalDuration={totalDuration}
          totalEarnings={totalEarnings}
          filterPeriod={filterPeriod}
        />
        
        <CompletedJobsTable 
          completedJobs={filteredCompletedJobs}
          jobCountByDate={jobCountByDate}
        />
      </CardContent>
    </Card>
  );
};

export default CompletedJobsSection;
