
import { useState, useEffect } from "react";
import { useStaffInvitations } from "@/hooks/staff/useStaffInvitations";
import { StaffInvitation } from "@/hooks/staff/types";

export const useInvitationVerification = (token?: string) => {
  const { verifyInvitation } = useStaffInvitations();
  
  const [invitation, setInvitation] = useState<StaffInvitation | null>(null);
  const [status, setStatus] = useState<"loading" | "valid" | "invalid">("loading");
  
  // Verify the invitation token
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("invalid");
        return;
      }
      
      try {
        console.log("Verifying invitation token:", token);
        const invitation = await verifyInvitation.mutateAsync({ token });
        console.log("Invitation verified:", invitation);
        setInvitation(invitation);
        setStatus("valid");
      } catch (error) {
        console.error("Error verifying invitation:", error);
        setStatus("invalid");
      }
    };
    
    verifyToken();
  }, [token, verifyInvitation]);

  return { invitation, status };
};
