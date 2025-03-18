
import React from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StaffAssignmentSection from "./StaffAssignmentSection";
import { useServiceStaffAssignments } from "@/hooks/useServiceStaffAssignments";
import { useStaffData } from "@/hooks/useStaffData";

interface StaffAssignmentDialogProps {
  serviceId: string;
  serviceName: string;
}

const StaffAssignmentDialog: React.FC<StaffAssignmentDialogProps> = ({ 
  serviceId, 
  serviceName 
}) => {
  const { data: staffData, isLoading: isStaffLoading } = useStaffData();
  const { staffAssignments, assignStaffToService } = useServiceStaffAssignments(serviceId);

  const selectedStaff = staffAssignments?.map(assignment => assignment.id) || [];

  const handleStaffChange = async (staffIds: string[]) => {
    await assignStaffToService(serviceId, staffIds);
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Assign Staff to {serviceName}</DialogTitle>
      </DialogHeader>
      
      <StaffAssignmentSection
        selectedStaff={selectedStaff}
        onStaffChange={handleStaffChange}
        staffData={staffData}
        isStaffLoading={isStaffLoading}
      />
    </DialogContent>
  );
};

export default StaffAssignmentDialog;
