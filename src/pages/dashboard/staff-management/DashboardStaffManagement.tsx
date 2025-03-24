
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaffDialog } from "@/components/staff/StaffDialog";
import StaffMembersTab from "./StaffMembersTab";
import WorkLogsTab from "./WorkLogsTab";

const DashboardStaffManagement = () => {
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);

  const handleAddStaff = () => {
    setSelectedStaffId(null);
    setStaffDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Staff Management</h1>
          <p className="text-muted-foreground">Manage your staff members, track work hours, and assign services.</p>
        </div>
        <Button className="md:self-start" onClick={handleAddStaff}>
          <UserPlus className="mr-2 h-4 w-4" />
          Create Staff Account
        </Button>
      </div>

      <Tabs defaultValue="staff">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="staff">Staff Members</TabsTrigger>
          <TabsTrigger value="work-logs">Work Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="staff" className="mt-6">
          <StaffMembersTab 
            onSelectStaff={(staffId) => {
              setSelectedStaffId(staffId);
              setStaffDialogOpen(true);
            }} 
            onOpenCreateDialog={handleAddStaff} 
          />
        </TabsContent>
        
        <TabsContent value="work-logs" className="mt-6">
          <WorkLogsTab selectedStaffId={selectedStaffId} />
        </TabsContent>
      </Tabs>
      
      <StaffDialog
        staffId={selectedStaffId}
        open={staffDialogOpen}
        onOpenChange={setStaffDialogOpen}
        onSuccess={() => {
          setStaffDialogOpen(false);
          setSelectedStaffId(null);
        }}
      />
    </div>
  );
};

export default DashboardStaffManagement;
