
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, AlertCircle } from "lucide-react";
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
import { StaffMember } from "@/types/business.types";

const StaffManagementTab = () => {
  const { user } = useAuth();
  const {
    staffList,
    loading: isLoading,
    error,
    fetchStaffMembers,
    fetchInvitations
  } = useStaffManagement();

  const {
    invitations,
    isLoading: isLoadingInvitations,
    refetch: refetchInvitations
  } = useStaffInvitations();

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [suspendingStaff, setSuspendingStaff] = useState<StaffMember | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<StaffMember | null>(null);
  const [reactivatingStaff, setReactivatingStaff] = useState<StaffMember | null>(null);

  // Function to refetch data
  const refetch = () => {
    if (user?.businessId) {
      fetchStaffMembers(user.businessId);
      fetchInvitations(user.businessId);
    }
  };

  // Simple status change handler
  const handleStatusChange = async (staff: StaffMember, status: 'active' | 'suspended' | 'deleted') => {
    // You'd implement this fully based on your business logic
    refetch();
    setSuspendingStaff(null);
    setDeletingStaff(null);
    setReactivatingStaff(null);
  };

  // Handle edit staff
  const handleEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
  };

  // Handle suspend staff
  const handleSuspendStaff = (staff: StaffMember) => {
    setSuspendingStaff(staff);
  };

  // Handle delete staff
  const handleDeleteStaff = (staff: StaffMember) => {
    setDeletingStaff(staff);
  };

  // Handle reactivate staff
  const handleReactivateStaff = (staff: StaffMember) => {
    setReactivatingStaff(staff);
  };

  // Check if user is a business owner or admin
  const canManageStaff = user?.plan === 'business' || user?.plan === 'co-admin' || user?.plan === 'admin';
  const isBusinessOwner = user?.plan === 'business';

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
            staffMembers={staffList}
            isLoading={isLoading}
            hasError={!!error}
            onCreateStaff={() => setInviteDialogOpen(true)}
            onEditStaff={handleEditStaff}
            onSuspendStaff={handleSuspendStaff}
            onDeleteStaff={handleDeleteStaff}
            onReactivateStaff={handleReactivateStaff}
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
        onInvited={refetchInvitations}
      />
      
      {editingStaff && (
        <EditStaffDialog
          staff={editingStaff}
          open={!!editingStaff}
          onOpenChange={(open) => {
            if (!open) setEditingStaff(null);
          }}
          onSave={refetch}
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
