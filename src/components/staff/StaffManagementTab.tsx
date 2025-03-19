
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CreateStaffDialog from "./CreateStaffDialog";
import EditStaffDialog from "./EditStaffDialog";
import StaffDialogs from "./StaffDialogs";
import StaffList from "./StaffList";
import { useStaffManagement } from "./useStaffManagement";
import { useAuth } from "@/hooks/useAuth";

const StaffManagementTab = () => {
  const { user } = useAuth();
  const {
    staffMembers,
    isLoading,
    error,
    refetch,
    editingStaff,
    setEditingStaff,
    suspendingStaff,
    setSuspendingStaff,
    deletingStaff,
    setDeletingStaff,
    reactivatingStaff,
    setReactivatingStaff,
    createDialogOpen,
    setCreateDialogOpen,
    handleStatusChange,
    isBusinessOwner
  } = useStaffManagement();

  // Check if user is a business owner or admin
  const canManageStaff = isBusinessOwner || user?.plan === 'co-admin' || user?.plan === 'admin';

  // If the user is not a business owner or admin, show an access denied message
  if (!canManageStaff) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You do not have permission to manage staff. Only business owners and administrators can access this feature.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Staff Members</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Create Staff Member
        </Button>
      </div>
      
      <StaffList
        staffMembers={staffMembers}
        isLoading={isLoading}
        hasError={!!error}
        onCreateStaff={() => setCreateDialogOpen(true)}
        onEditStaff={setEditingStaff}
        onSuspendStaff={setSuspendingStaff}
        onDeleteStaff={setDeletingStaff}
        onReactivateStaff={setReactivatingStaff}
      />
      
      <CreateStaffDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreated={refetch}
      />
      
      {editingStaff && (
        <EditStaffDialog
          staff={editingStaff}
          open={!!editingStaff}
          onOpenChange={(open) => {
            if (!open) setEditingStaff(null);
          }}
          onSave={() => {
            refetch();
            setEditingStaff(null);
          }}
        />
      )}
      
      <StaffDialogs
        suspendingStaff={suspendingStaff}
        deletingStaff={deletingStaff}
        reactivatingStaff={reactivatingStaff}
        onSuspendingStaffChange={setSuspendingStaff}
        onDeletingStaffChange={setDeletingStaff}
        onReactivatingStaffChange={setReactivatingStaff}
        onStatusChange={handleStatusChange}
      />
    </>
  );
};

export default StaffManagementTab;
