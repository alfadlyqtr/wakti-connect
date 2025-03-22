
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobCardsTab } from "@/components/jobs/JobCardsTab";
import { JobsTab } from "@/components/jobs/JobsTab";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateJobDialog } from "@/components/jobs/CreateJobDialog";
import { CreateJobCardDialog } from "@/components/jobs/CreateJobCardDialog";

const DashboardJobCards = () => {
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [createJobCardOpen, setCreateJobCardOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("job-cards");

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs & Cards</h1>
          <p className="text-muted-foreground">
            Manage job entries and job cards for your business
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "jobs" ? (
            <Button onClick={() => setCreateJobOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Job
            </Button>
          ) : (
            <Button onClick={() => setCreateJobCardOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Job Card
            </Button>
          )}
        </div>
      </div>

      <Tabs
        defaultValue="job-cards"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="job-cards">Job Cards</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
        </TabsList>
        <TabsContent value="job-cards" className="mt-6">
          <JobCardsTab />
        </TabsContent>
        <TabsContent value="jobs" className="mt-6">
          <JobsTab />
        </TabsContent>
      </Tabs>

      <CreateJobDialog
        open={createJobOpen}
        onOpenChange={setCreateJobOpen}
      />
      <CreateJobCardDialog
        open={createJobCardOpen}
        onOpenChange={setCreateJobCardOpen}
      />
    </div>
  );
};

export default DashboardJobCards;
