
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { isUserStaff } from "@/utils/staffUtils";

interface SidebarProfileProps {
  profileData: {
    id: string;
    full_name: string | null;
    display_name: string | null;
    business_name: string | null;
    account_type: "free" | "individual" | "business";
    avatar_url: string | null;
  } | null;
  collapsed: boolean;
}

const SidebarProfile: React.FC<SidebarProfileProps> = ({ profileData, collapsed }) => {
  const [isUserStaffMember, setIsUserStaffMember] = useState(false);
  const [businessName, setBusinessName] = useState<string | null>(null);
  
  // Check if user is staff on component mount
  useEffect(() => {
    const checkStaffStatus = async () => {
      const staffStatus = await isUserStaff();
      setIsUserStaffMember(staffStatus);
      
      if (staffStatus) {
        // Get business information for staff display
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          try {
            const { data, error } = await supabase
              .from('business_staff')
              .select(`
                business_id,
                profiles:business_id (
                  business_name
                )
              `)
              .eq('staff_id', user.id)
              .maybeSingle();
              
            // Check if data exists, is not an error, and contains the profiles object
            if (data && !error && data.profiles && 
                typeof data.profiles === 'object' && 
                data.profiles !== null) {
              // Safely access business_name with type checking
              const businessProfiles = data.profiles as { business_name?: string };
              if (businessProfiles && 'business_name' in businessProfiles) {
                setBusinessName(businessProfiles.business_name || null);
              }
            }
          } catch (err) {
            console.error("Error fetching business name:", err);
          }
        }
      }
    };
    
    // Check localStorage first for quick loading
    if (localStorage.getItem('isStaff') === 'true') {
      setIsUserStaffMember(true);
    } else {
      checkStaffStatus();
    }
  }, []);
  
  // Determine display name for profile
  const getDisplayName = () => {
    if (isUserStaffMember && profileData) {
      return profileData.full_name || profileData.display_name || 'Staff Member';
    }
    
    if (profileData?.account_type === 'business') {
      return profileData?.business_name || 'Business Account';
    }
    if (profileData?.display_name) return profileData.display_name;
    if (profileData?.full_name) return profileData.full_name;
    
    // Provide role-based fallback
    if (profileData?.account_type === 'individual') return 'Individual Account';
    return 'User';
  };
  
  const getSubtitle = () => {
    if (isUserStaffMember) {
      return businessName ? `Staff at ${businessName}` : 'Staff Member';
    }
    
    if (profileData?.account_type === 'business') {
      return profileData?.full_name ? `${profileData.full_name}` : 'Account Admin'; 
    }
    return `${profileData?.account_type || 'Free'} Plan`;
  };

  return (
    <div className={`px-4 mb-6 ${collapsed ? 'text-center' : ''}`}>
      <NavLink to="/dashboard/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profileData?.avatar_url || undefined} />
          <AvatarFallback className="bg-wakti-blue/10 text-wakti-blue">
            {getDisplayName().charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-medium text-sm truncate max-w-[130px]">{getDisplayName()}</p>
            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground truncate max-w-[100px]">{getSubtitle()}</p>
              {isUserStaffMember && (
                <Badge variant="outline" className="text-[10px] py-0 h-4 px-1 border-wakti-blue text-wakti-blue">
                  Staff
                </Badge>
              )}
              {profileData?.account_type === 'business' && (
                <Badge variant="outline" className="text-[10px] py-0 h-4 px-1 border-wakti-blue text-wakti-blue">
                  Admin
                </Badge>
              )}
            </div>
          </div>
        )}
      </NavLink>
    </div>
  );
};

export default SidebarProfile;
