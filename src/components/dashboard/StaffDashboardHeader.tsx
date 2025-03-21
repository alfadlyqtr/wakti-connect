
import React from "react";
import { Building2, CalendarClock, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface StaffDashboardHeaderProps {
  staffId: string;
}

interface StaffBusinessInfo {
  businessName: string;
  position: string;
  businessAvatar?: string | null;
  joinedAt?: string;
  location?: string | null;
}

const StaffDashboardHeader: React.FC<StaffDashboardHeaderProps> = ({ staffId }) => {
  const { data: businessInfo, isLoading } = useQuery({
    queryKey: ['staffBusinessInfo', staffId],
    queryFn: async (): Promise<StaffBusinessInfo | null> => {
      try {
        // First get the business relation and staff details
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .select('business_id, position, created_at')
          .eq('staff_id', staffId)
          .maybeSingle();
          
        if (staffError || !staffData) {
          console.error("Error fetching staff business relation:", staffError);
          return {
            businessName: 'Business',
            position: 'Staff Member'
          };
        }
        
        // Then get the business profile information 
        const { data: businessData, error: businessError } = await supabase
          .from('profiles')
          .select('business_name, avatar_url, occupation')
          .eq('id', staffData.business_id)
          .maybeSingle();
          
        if (businessError || !businessData) {
          console.error("Error fetching business profile:", businessError);
          return {
            businessName: 'Business',
            position: staffData.position || 'Staff Member',
            joinedAt: staffData.created_at
          };
        }
        
        return {
          businessName: businessData.business_name || 'Business',
          position: staffData.position || 'Staff Member',
          businessAvatar: businessData.avatar_url,
          joinedAt: staffData.created_at,
          location: businessData.occupation
        };
      } catch (error) {
        console.error("Error in staff dashboard header:", error);
        // Return fallback data to prevent UI errors
        return {
          businessName: 'Business',
          position: 'Staff Member'
        };
      }
    },
    // Only run the query if staffId is available
    enabled: !!staffId,
    // Add some retry logic for better error handling
    retry: 1,
    retryDelay: 1000
  });

  if (isLoading) {
    return <div className="h-16 animate-pulse bg-muted rounded w-full"></div>;
  }

  const joinedDate = businessInfo?.joinedAt ? 
    new Date(businessInfo.joinedAt).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }) : null;

  return (
    <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg border text-sm mb-6">
      <Avatar className="h-10 w-10 border">
        <AvatarImage src={businessInfo?.businessAvatar || ''} alt={businessInfo?.businessName || 'Business'} />
        <AvatarFallback className="bg-wakti-blue/10 text-wakti-blue">
          {businessInfo?.businessName?.substring(0, 2).toUpperCase() || 'BZ'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center">
          <Building2 className="h-4 w-4 text-wakti-blue mr-1.5" />
          <Link to="/dashboard/business" className="font-medium hover:text-wakti-blue transition-colors">
            {businessInfo?.businessName}
          </Link>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center text-xs text-muted-foreground gap-y-1 gap-x-3 mt-1">
          <span>{businessInfo?.position}</span>
          
          {joinedDate && (
            <span className="flex items-center gap-1">
              <CalendarClock className="h-3 w-3" />
              Joined {joinedDate}
            </span>
          )}
          
          {businessInfo?.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {businessInfo.location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardHeader;
