
import React, { useState, useEffect } from "react";
import { StaffList } from "@/components/staff/StaffList";
import { StaffDialog } from "@/components/staff/StaffDialog";
import { useToast } from "@/components/ui/use-toast";
import StaffHeader from "@/components/staff/StaffHeader";
import StaffLimitWarning from "@/components/staff/StaffLimitWarning";
import { useStaffMembers } from "@/hooks/staff/useStaffMembers";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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

  // Force refetch on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

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
    
    // Invalidate queries and force a refetch
    queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
    setTimeout(() => {
      refetch();
    }, 500);
    
    setStaffDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <StaffHeader 
          onAddStaff={handleAddStaff}
          onRefresh={refetch}
          canAddMoreStaff={canAddMoreStaff}
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSyncStaff}
          disabled={isSyncing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      <StaffLimitWarning show={!canAddMoreStaff} />
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">Error loading staff members: {(error as Error).message}</p>
          <Button variant="outline" className="mt-2" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      )}
      
      <StaffList 
        staffMembers={staffMembers || []}
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
