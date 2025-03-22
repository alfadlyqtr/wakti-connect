
import React from "react";
import { useStaffInvitations } from "@/hooks/staff/useStaffInvitations";
import { 
  InvitationsList, 
  InvitationInfoAlert 
} from "./invitation";

const InvitationsTab = () => {
  const { invitations, isLoading, resendInvitation, cancelInvitation } = useStaffInvitations();
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <InvitationInfoAlert />
      <InvitationsList 
        invitations={invitations} 
        resendInvitation={resendInvitation} 
        cancelInvitation={cancelInvitation} 
      />
    </div>
  );
};

export default InvitationsTab;
