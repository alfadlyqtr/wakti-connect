
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import CreateStaffDialog from "./CreateStaffDialog";
import EditStaffDialog from "./EditStaffDialog";
import StaffDialogs from "./StaffDialogs";
import StaffList from "./StaffList";
import { useStaffManagement } from "./useStaffManagement";

const StaffManagementTab = () => {
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
    handleStatusChange
  } = useStaffManagement();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Staff Members</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
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
