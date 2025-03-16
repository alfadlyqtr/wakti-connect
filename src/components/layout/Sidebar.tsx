
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SidebarNavItems } from "./sidebar/SidebarNavItems";
import SidebarUpgradeBanner from "./sidebar/SidebarUpgradeBanner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SidebarProps {
  isOpen: boolean;
  userRole?: "free" | "individual" | "business";
}

const Sidebar = ({ isOpen, userRole = "free" }: SidebarProps) => {
  // Fetch profile data for display name and avatar
  const { data: profileData } = useQuery({
    queryKey: ['sidebarProfile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return null;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, display_name, business_name, avatar_url')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      return data;
    },
  });

  // Get display name for sidebar
  const getDisplayName = () => {
    if (profileData?.display_name) return profileData.display_name;
    if (profileData?.business_name && userRole === 'business') return profileData.business_name;
    if (profileData?.full_name) return profileData.full_name;
    return 'Wakti User';
  };

  // Get initial for avatar fallback
  const getInitial = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 w-64 bg-sidebar z-40 border-r border-border transition-transform duration-300 ease-in-out transform",
        {
          "translate-x-0": isOpen,
          "-translate-x-full": !isOpen,
        },
        "lg:translate-x-0" // Always visible on large screens
      )}
    >
      <div className="h-full flex flex-col">
        <div className="px-6 py-6 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profileData?.avatar_url || undefined} alt="Profile" />
              <AvatarFallback>{getInitial()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h2 className="text-base font-semibold text-foreground truncate max-w-[160px]">
                {getDisplayName()}
              </h2>
              <div className="flex items-center">
                {userRole === "free" && (
                  <Badge variant="outline" className="text-xs bg-wakti-gold/10 text-wakti-gold">
                    Free
                  </Badge>
                )}
                {userRole === "individual" && (
                  <Badge variant="outline" className="text-xs bg-wakti-blue/10 text-wakti-blue">
                    Individual
                  </Badge>
                )}
                {userRole === "business" && (
                  <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500">
                    Business
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <SidebarNavItems userRole={userRole} />
        </nav>
        
        {userRole === "free" && <SidebarUpgradeBanner />}
      </div>
    </aside>
  );
};

export default Sidebar;
