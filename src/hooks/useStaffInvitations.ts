
import { useState, useEffect } from "react";
import { StaffInvitation, getBusinessStaffInvitations } from "@/services/staff/staffInvitationService";
import { useAuth } from "@/hooks/useAuth";

export const useStaffInvitations = () => {
  const [invitations, setInvitations] = useState<StaffInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchInvitations = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const invitationsList = await getBusinessStaffInvitations();
      setInvitations(invitationsList);
    } catch (err: any) {
      console.error("Error fetching staff invitations:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [user?.id]);

  return {
    invitations,
    isLoading,
    error,
    refetch: fetchInvitations
  };
};

export default useStaffInvitations;
