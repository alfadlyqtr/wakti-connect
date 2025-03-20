
import React from "react";
import { StaffInvitation } from "@/hooks/staff/types";
import InvitationCard from "./InvitationCard";
import EmptyInvitationsState from "./EmptyInvitationsState";
import { UseMutationResult } from "@tanstack/react-query";

interface InvitationsListProps {
  invitations: StaffInvitation[] | undefined;
  resendInvitation: UseMutationResult<StaffInvitation, Error, string>;
  cancelInvitation: UseMutationResult<string, Error, string>;
}

const InvitationsList = ({ 
  invitations, 
  resendInvitation, 
  cancelInvitation 
}: InvitationsListProps) => {
  if (!invitations || invitations.length === 0) {
    return <EmptyInvitationsState />;
  }

  return (
    <div className="grid gap-4">
      {invitations.map(invitation => (
        <InvitationCard
          key={invitation.id}
          invitation={invitation}
          resendInvitation={() => resendInvitation.mutate(invitation.id)}
          cancelInvitation={() => cancelInvitation.mutate(invitation.id)}
          isResending={resendInvitation.isPending && resendInvitation.variables === invitation.id}
          isCancelling={cancelInvitation.isPending && cancelInvitation.variables === invitation.id}
        />
      ))}
    </div>
  );
};

export default InvitationsList;
