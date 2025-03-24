
import React, { useState } from "react";
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
    isLoading: isAssignmentsLoading
  } = useServiceStaffAssignments(serviceId);

  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>(
    staffAssignments?.map(staff => staff.id) || []
  );

  // Update local state when staffAssignments data loads
  React.useEffect(() => {
    if (staffAssignments) {
      setSelectedStaffIds(staffAssignments.map(staff => staff.id));
    }
  }, [staffAssignments]);

  const handleStaffChange = (staffIds: string[]) => {
    setSelectedStaffIds(staffIds);
  };

  const handleSave = async () => {
    await assignStaffToService(selectedStaffIds);
  };

  const isLoading = isStaffLoading || isAssignmentsLoading;

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Assign Staff to {serviceName}</DialogTitle>
      </DialogHeader>
      
      <StaffAssignmentSection
        selectedStaff={selectedStaffIds}
        onStaffChange={handleStaffChange}
        staffData={staffData}
        isStaffLoading={isLoading}
      />
      
      <div className="flex justify-end gap-2 mt-4 pt-2 border-t">
        <Button 
          variant="outline" 
          onClick={() => setSelectedStaffIds(staffAssignments?.map(staff => staff.id) || [])}
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
