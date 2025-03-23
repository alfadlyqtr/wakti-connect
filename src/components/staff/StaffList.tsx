
import React, { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { StaffMember } from "@/types/staff";
import EmptyStaffState from "./staff-list/EmptyStaffState";
import StaffMembersLoading from "./staff-list/StaffMembersLoading";
import StaffMembersError from "./staff-list/StaffMembersError";
import StaffMembersList from "./staff-list/StaffMembersList";
import DeleteStaffDialog from "./staff-list/DeleteStaffDialog";
import ToggleStatusDialog from "./staff-list/ToggleStatusDialog";
import { useStaffSync } from "./staff-list/useStaffSync";

interface StaffListProps {
  staffMembers: StaffMember[];
  staffData?: any[]; // For backwards compatibility
  isLoading: boolean;
  error: Error | null;
  onEdit: (staffId: string) => void;
  onRefresh: () => void;
}

export const StaffList: React.FC<StaffListProps> = ({
  staffMembers,
  staffData,
  isLoading,
  error,
  onEdit,
  onRefresh,
}) => {
  const displayStaff = staffData || staffMembers;
  const { toast } = useToast();
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toggleStatusConfirmOpen, setToggleStatusConfirmOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  
  const { isSyncing, syncStaffRecords } = useStaffSync({ onSuccess: onRefresh });

  const handleDeleteClick = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setDeleteConfirmOpen(true);
  };

  const handleToggleStatusClick = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setToggleStatusConfirmOpen(true);
  };

  if (isLoading) {
    return <StaffMembersLoading />;
  }

  if (error) {
    return (
      <StaffMembersError 
        errorMessage={error.message}
        onRetry={onRefresh}
        onSync={syncStaffRecords}
        isSyncing={isSyncing}
      />
    );
  }

  if (!displayStaff || displayStaff.length === 0) {
    return (
      <EmptyStaffState 
        onAddStaffClick={() => onEdit("")} 
        onSyncStaffClick={syncStaffRecords}
        isSyncing={isSyncing}
      />
    );
  }

  console.log("Rendering staff list with members:", displayStaff);

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
          onClick={syncStaffRecords}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          {isSyncing ? "Syncing..." : "Sync Staff Records"}
        </button>
      </div>
      
      <StaffMembersList
        staffMembers={displayStaff}
        onEdit={onEdit}
        onDelete={handleDeleteClick}
        onToggleStatus={handleToggleStatusClick}
      />

      <DeleteStaffDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        selectedStaff={selectedStaff}
        onSuccess={onRefresh}
      />

      <ToggleStatusDialog
        open={toggleStatusConfirmOpen}
        onOpenChange={setToggleStatusConfirmOpen}
        selectedStaff={selectedStaff}
        onSuccess={onRefresh}
      />
    </div>
  );
};

export default StaffList;
