
import React, { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, UserPlus, RefreshCw } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StaffMemberCard } from "./StaffMemberCard";
import { StaffMember } from "@/types/staff";

interface StaffListProps {
  staffMembers: StaffMember[];
  staffData?: any[]; // For backwards compatibility
  isLoading: boolean;
  error: Error | null;
  onEdit: (staffId: string) => void;
  onRefresh: () => void;
}

// EmptyStaffState component with its props interface
interface EmptyStaffStateProps {
  onAddStaffClick: () => void;
}

const EmptyStaffState: React.FC<EmptyStaffStateProps> = ({ onAddStaffClick }) => (
  <Card className="text-center p-6">
    <div className="flex flex-col items-center justify-center">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <UserPlus className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-2">No staff members yet</h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        Add staff members to your business to help manage tasks, appointments, and services.
      </p>
      <Button onClick={onAddStaffClick}>
        <UserPlus className="h-4 w-4 mr-2" />
        Add Staff Member
      </Button>
    </div>
  </Card>
);

export const StaffList: React.FC<StaffListProps> = ({
  staffMembers,
  staffData,
  isLoading,
  error,
  onEdit,
  onRefresh,
}) => {
  // Use staffData if it's provided, otherwise use staffMembers
  const displayStaff = staffData || staffMembers;
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toggleStatusConfirmOpen, setToggleStatusConfirmOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const handleDeleteClick = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setDeleteConfirmOpen(true);
  };

  const handleToggleStatusClick = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setToggleStatusConfirmOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-5 w-5 animate-spin mr-2" />
          <p>Loading staff members...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center text-destructive space-x-2 mb-4">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">Failed to load staff members</p>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        <Button size="sm" onClick={onRefresh}>Retry</Button>
      </Card>
    );
  }

  if (!displayStaff || displayStaff.length === 0) {
    return <EmptyStaffState onAddStaffClick={() => onEdit("")} />;
  }

  console.log("Rendering staff list with members:", displayStaff);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayStaff.map((staff) => (
          <StaffMemberCard
            key={staff.id}
            staff={staff}
            onEdit={() => onEdit(staff.id)}
            onDelete={() => handleDeleteClick(staff)} 
            onToggleStatus={() => handleToggleStatusClick(staff)}
          />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedStaff?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // Delete staff functionality will be handled in parent component
                setDeleteConfirmOpen(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toggle Status Dialog */}
      <AlertDialog open={toggleStatusConfirmOpen} onOpenChange={setToggleStatusConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedStaff?.status === 'active' ? 'Suspend' : 'Activate'} Staff Member
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {selectedStaff?.status === 'active' ? 'suspend' : 'activate'} {selectedStaff?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // Toggle status functionality will be handled in parent component
                setToggleStatusConfirmOpen(false);
              }}
            >
              Confirm
            </AlertDialogAction>
          </DialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StaffList;
