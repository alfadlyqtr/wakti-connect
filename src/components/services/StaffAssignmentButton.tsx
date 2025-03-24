
import React from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import StaffAssignmentDialog from "./StaffAssignmentDialog";

interface StaffAssignmentButtonProps {
  serviceId: string;
  serviceName: string;
  staffCount: number;
}

const StaffAssignmentButton: React.FC<StaffAssignmentButtonProps> = ({
  serviceId,
  serviceName,
  staffCount
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Users className="h-4 w-4 mr-2" />
          {staffCount > 0 
            ? `${staffCount} staff ${staffCount === 1 ? 'member' : 'members'} assigned` 
            : "Assign Staff"}
        </Button>
      </DialogTrigger>
      <StaffAssignmentDialog 
        serviceId={serviceId} 
        serviceName={serviceName} 
      />
    </Dialog>
  );
};

export default StaffAssignmentButton;
