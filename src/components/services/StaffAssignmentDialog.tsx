
import React, { useState, useEffect } from "react";
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
  const { data: staffData, isLoading: isStaffLoading } = useStaffData();
  const { 
    staffAssignments, 
    assignStaffToService,
    isPending,
    isLoading: isAssignmentsLoading,
    initialAssignmentsDone
  } = useServiceStaffAssignments(serviceId);

  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

  // Update local state when staffAssignments data loads
  useEffect(() => {
    if (staffAssignments && initialAssignmentsDone) {
      setSelectedStaffIds(staffAssignments.map(staff => staff.id));
    }
  }, [staffAssignments, initialAssignmentsDone]);

  const handleStaffChange = (staffIds: string[]) => {
    setSelectedStaffIds(staffIds);
  };

  const handleSave = async () => {
    await assignStaffToService(selectedStaffIds);
  };

  const handleCancel = () => {
    if (staffAssignments) {
      setSelectedStaffIds(staffAssignments.map(staff => staff.id));
    }
  };

  // Filter staff to only show service providers
  const serviceProviderStaff = staffData?.filter(staff => staff.is_service_provider) || [];
  
  const isLoading = isStaffLoading || isAssignmentsLoading;

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
