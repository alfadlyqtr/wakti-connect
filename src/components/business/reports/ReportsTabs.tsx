
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GrowthTabContent } from "./GrowthTabContent";
import { EngagementTabContent } from "./EngagementTabContent";
import { ServicesTabContent } from "./ServicesTabContent";
import { StaffTabContent } from "./StaffTabContent";

export const ReportsTabs: React.FC = () => {
  return (
    <Tabs defaultValue="growth">
      <TabsList className="flex overflow-x-auto space-x-1 py-1 px-1">
        <TabsTrigger value="growth">Growth</TabsTrigger>
        <TabsTrigger value="engagement">Engagement</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="staff">Staff</TabsTrigger>
      </TabsList>
      
      <TabsContent value="growth" className="mt-4 sm:mt-6">
        <GrowthTabContent />
      </TabsContent>
      
      <TabsContent value="engagement" className="mt-4 sm:mt-6">
        <EngagementTabContent />
      </TabsContent>
      
      <TabsContent value="services" className="mt-4 sm:mt-6">
        <ServicesTabContent />
      </TabsContent>
      
      <TabsContent value="staff" className="mt-4 sm:mt-6">
        <StaffTabContent />
      </TabsContent>
    </Tabs>
  );
};
