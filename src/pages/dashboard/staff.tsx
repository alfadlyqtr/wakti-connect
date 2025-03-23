
import React, { useState } from "react";
import { StaffList } from "@/components/staff/StaffList";
import { StaffDialog } from "@/components/staff/StaffDialog";
import { useToast } from "@/components/ui/use-toast";
import StaffHeader from "@/components/staff/StaffHeader";
import StaffLimitWarning from "@/components/staff/StaffLimitWarning";
import { useStaffMembers } from "@/hooks/staff/useStaffMembers";
import { useQueryClient } from "@tanstack/react-query";

export default function StaffPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  
  const { 
    staffMembers,
    isLoading,
    error,
    refetch,
    canAddMoreStaff,
    handleSyncStaff,
    isSyncing
  } = useStaffMembers();

  const handleAddStaff = () => {
    setSelectedStaffId(null);
    setStaffDialogOpen(true);
  };

  const handleEditStaff = (staffId: string) => {
    setSelectedStaffId(staffId);
    setStaffDialogOpen(true);
  };

  const handleStaffCreated = () => {
    toast({
      title: "Success",
      description: selectedStaffId 
        ? "Staff member updated successfully"
        : "Staff member added successfully",
    });
    
    queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
    refetch();
    
    setStaffDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <StaffHeader 
        onAddStaff={handleAddStaff}
        onRefresh={refetch}
        canAddMoreStaff={canAddMoreStaff}
      />
      
      <StaffLimitWarning show={!canAddMoreStaff} />
      
      <StaffList 
        staffMembers={staffMembers}
        isLoading={isLoading}
        error={error as Error | null}
        onEdit={handleEditStaff}
        onRefresh={refetch}
      />
      
      <StaffDialog
        staffId={selectedStaffId}
        open={staffDialogOpen}
        onOpenChange={setStaffDialogOpen}
        onSuccess={handleStaffCreated}
      />
    </div>
  );
}
