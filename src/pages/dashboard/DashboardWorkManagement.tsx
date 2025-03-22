
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Briefcase, FileText } from "lucide-react";

// Reusing the existing functionality but with tabs
const DashboardWorkManagement = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  
  // Import the components dynamically to avoid circular dependencies
  const JobsTab = React.lazy(() => import("@/components/jobs/JobsTab"));
  const JobCardsTab = React.lazy(() => import("@/components/jobs/JobCardsTab"));
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Work Management</h1>
          <p className="text-muted-foreground">
            Manage jobs, create job cards, and track work progress
          </p>
        </div>
        
        {activeTab === "jobs" ? (
          <Button onClick={() => document.getElementById("create-job-button")?.click()}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Job
          </Button>
        ) : (
          <Button 
            onClick={() => document.getElementById("create-job-card-button")?.click()}
            disabled={document.getElementById("create-job-card-button")?.hasAttribute("disabled")}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Job Card
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="jobs" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Jobs
          </TabsTrigger>
          <TabsTrigger value="job-cards" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Job Cards
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs" className="mt-0">
          <React.Suspense fallback={<div>Loading...</div>}>
            <JobsTab />
          </React.Suspense>
        </TabsContent>
        
        <TabsContent value="job-cards" className="mt-0">
          <React.Suspense fallback={<div>Loading...</div>}>
            <JobCardsTab />
          </React.Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardWorkManagement;
