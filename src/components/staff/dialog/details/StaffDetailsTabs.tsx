
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { DetailsTab } from "./tabs/DetailsTab";
import { PermissionsTab } from "./tabs/PermissionsTab";
import { EditStaffFormValues, StaffRelationData } from "./hooks/useStaffDetailsForm";

interface StaffDetailsTabsProps {
  form: UseFormReturn<EditStaffFormValues>;
  staffData: StaffRelationData;
  activeTab: string;
}

export const StaffDetailsTabs: React.FC<StaffDetailsTabsProps> = ({ 
  form, 
  staffData,
  activeTab 
}) => {
  return (
    <Form {...form}>
      <form id="staff-details-form" onSubmit={form.handleSubmit((data) => {})}>
        <TabsContent value="details" className="space-y-4 py-4">
          <DetailsTab form={form} staffData={staffData} />
        </TabsContent>
        
        <TabsContent value="permissions" className="space-y-4 py-4">
          <PermissionsTab form={form} />
        </TabsContent>
      </form>
    </Form>
  );
};
