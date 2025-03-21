
import React, { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface StaffDashboardHeaderProps {
  staffId: string;
}

const StaffDashboardHeader: React.FC<StaffDashboardHeaderProps> = ({ staffId }) => {
  const { data: businessInfo, isLoading } = useQuery({
    queryKey: ['staffBusinessInfo', staffId],
    queryFn: async () => {
      const { data: staffData, error: staffError } = await supabase
        .from('business_staff')
        .select(`
          business_id,
          position,
          profiles:business_id (
            business_name
          )
        `)
        .eq('staff_id', staffId)
        .maybeSingle();
        
      if (staffError) {
        console.error("Error fetching staff business info:", staffError);
        return null;
      }
      
      return {
        businessName: staffData?.profiles?.business_name || 'Business',
        position: staffData?.position || 'Staff Member'
      };
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
