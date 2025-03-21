
import React from "react";
import { Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface StaffDashboardHeaderProps {
  staffId: string;
}

interface StaffBusinessInfo {
  businessName: string;
  position: string;
}

const StaffDashboardHeader: React.FC<StaffDashboardHeaderProps> = ({ staffId }) => {
  const { data: businessInfo, isLoading } = useQuery({
    queryKey: ['staffBusinessInfo', staffId],
    queryFn: async (): Promise<StaffBusinessInfo | null> => {
      try {
        // First get the business relation
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .select('business_id, position')
          .eq('staff_id', staffId)
          .maybeSingle();
          
        if (staffError || !staffData) {
          console.error("Error fetching staff business relation:", staffError);
          return {
            businessName: 'Business',
            position: 'Staff Member'
          };
        }
        
        // Then get the business name from profiles table
        const { data: businessData, error: businessError } = await supabase
          .from('profiles')
          .select('business_name')
          .eq('id', staffData.business_id)
          .maybeSingle();
          
        if (businessError || !businessData) {
          console.error("Error fetching business profile:", businessError);
          return {
            businessName: 'Business',
            position: staffData.position || 'Staff Member'
          };
        }
        
        return {
          businessName: businessData.business_name || 'Business',
          position: staffData.position || 'Staff Member'
        };
      } catch (error) {
        console.error("Error in staff dashboard header:", error);
        return {
          businessName: 'Business',
          position: 'Staff Member'
        };
      }
    },
    enabled: !!staffId
  });

  if (isLoading) {
    return <div className="h-8 animate-pulse bg-muted rounded w-52"></div>;
  }

  return (
    <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg border text-sm">
      <Building2 className="h-4 w-4 text-wakti-blue" />
      <div className="flex flex-col">
        <span className="font-medium">Staff Dashboard</span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          {businessInfo?.businessName}
          <span className="inline-block mx-1 text-muted-foreground">•</span>
          {businessInfo?.position}
        </span>
      </div>
    </div>
  );
};

export default StaffDashboardHeader;
