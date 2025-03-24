
import React, { useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StaffAssignmentSection from "./StaffAssignmentSection";
import { useServiceStaffAssignments } from "@/hooks/useServiceStaffAssignments";
import { useStaffData } from "@/hooks/useStaffData";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface StaffAssignmentDialogProps {
  serviceId: string;
  serviceName: string;
}

const StaffAssignmentDialog: React.FC<StaffAssignmentDialogProps> = ({ 
  serviceId, 
  serviceName 
}) => {
  const { data: allStaffData, isLoading: isStaffLoading } = useStaffData();
  const { 
    selectedStaffIds,
    handleStaffChange,
    handleSave,
    handleCancel,
    isPending,
    isLoading: isAssignmentsLoading,
    initialAssignmentsDone
  } = useServiceStaffAssignments(serviceId);

  // Only show staff members who are service providers
  const serviceProviderStaff = allStaffData?.filter(staff => staff.is_service_provider) || [];
  
  useEffect(() => {
    if (serviceProviderStaff.length > 0) {
      console.log("Available staff for service assignment:", 
        serviceProviderStaff.map(s => ({ id: s.id, name: s.name }))
      );
    }
    console.log("Selected staff IDs:", selectedStaffIds);
  }, [serviceProviderStaff, selectedStaffIds]);
  
  const isLoading = isStaffLoading || isAssignmentsLoading || !initialAssignmentsDone;

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Assign Staff to {serviceName}</DialogTitle>
      </DialogHeader>
      
      <StaffAssignmentSection
        selectedStaff={selectedStaffIds}
        onStaffChange={handleStaffChange}
        staffData={serviceProviderStaff}
        isStaffLoading={isLoading}
      />
      
      <div className="flex justify-end gap-2 mt-4 pt-2 border-t">
        <Button 
          variant="outline" 
          onClick={handleCancel}
          disabled={isPending || isLoading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isPending || isLoading}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Assignments'
          )}
        </Button>
      </div>
    </DialogContent>
  );
};

export default StaffAssignmentDialog;
