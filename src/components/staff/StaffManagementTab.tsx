
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, UserPlus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InviteStaffDialog from "./InviteStaffDialog";
import EditStaffDialog from "./EditStaffDialog";
import StaffDialogs from "./StaffDialogs";
import StaffList from "./StaffList";
import StaffInvitationsList from "./StaffInvitationsList";
import { useStaffManagement } from "./useStaffManagement";
import { useStaffInvitations } from "@/hooks/useStaffInvitations";
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
    handleStatusChange,
    isBusinessOwner
  } = useStaffManagement();

  const {
    invitations,
    isLoading: isLoadingInvitations,
    refetch: refetchInvitations
  } = useStaffInvitations();

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

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
        <Button onClick={() => setInviteDialogOpen(true)}>
          <Mail className="mr-2 h-4 w-4" />
          Invite Staff Member
        </Button>
      </div>
      
      <Tabs defaultValue="staff">
        <TabsList className="mb-6">
          <TabsTrigger value="staff">Active Staff</TabsTrigger>
          <TabsTrigger value="invitations">
            Invitations
            {invitations?.length > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                {invitations.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="staff">
          <StaffList
            staffMembers={staffMembers}
            isLoading={isLoading}
            hasError={!!error}
            onCreateStaff={() => setInviteDialogOpen(true)}
            onEditStaff={setEditingStaff}
            onSuspendStaff={setSuspendingStaff}
            onDeleteStaff={setDeletingStaff}
            onReactivateStaff={setReactivatingStaff}
          />
        </TabsContent>
        
        <TabsContent value="invitations">
          <StaffInvitationsList
            invitations={invitations}
            isLoading={isLoadingInvitations}
            onRefreshInvitations={refetchInvitations}
          />
        </TabsContent>
      </Tabs>
      
      <InviteStaffDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onInvited={() => {
          refetchInvitations();
        }}
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
