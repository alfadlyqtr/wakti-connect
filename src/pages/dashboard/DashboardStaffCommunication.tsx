
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import StaffCommunicationTab from "@/components/messages/StaffCommunicationTab";
import { getStaffBusinessId } from "@/utils/staffUtils";

const DashboardStaffCommunication = () => {
  const [businessId, setBusinessId] = React.useState<string | null>(null);

  // Fetch the current staff's business ID
  React.useEffect(() => {
    const fetchBusinessId = async () => {
      const bizId = await getStaffBusinessId();
      setBusinessId(bizId);
    };
    
    fetchBusinessId();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff Communication</h1>
        <p className="text-muted-foreground">
          Communicate with your business owner and other staff members
        </p>
      </div>
      
      <StaffCommunicationTab businessId={businessId} />
    </div>
  );
};

export default DashboardStaffCommunication;
