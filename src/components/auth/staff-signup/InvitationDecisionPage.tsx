
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useStaffInvitationDecision } from "@/hooks/staff/useStaffInvitationDecision";
import StaffInvitationVerification from "./StaffInvitationVerification";
import InvitationDecisionPageLayout from "./InvitationDecisionPageLayout";
import InvitationDecisionCard from "./InvitationDecisionCard";

const InvitationDecisionPage = () => {
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get("token") || "";
  const businessSlug = searchParams.get("business") || "";
  
  const {
    isLoading,
    isResponding,
    error,
    invitation,
    handleAccept,
    handleDecline
  } = useStaffInvitationDecision(token, businessSlug);

  // Loading, error or verification states
  if (isLoading || error || !invitation) {
    return (
      <StaffInvitationVerification 
        isLoading={isLoading} 
        error={error} 
        invitation={invitation}
        businessName={businessSlug.replace(/-/g, ' ')}
      />
    );
  }
  
  return (
    <InvitationDecisionPageLayout>
      <InvitationDecisionCard
        invitation={invitation}
        isResponding={isResponding}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </InvitationDecisionPageLayout>
  );
};

export default InvitationDecisionPage;
