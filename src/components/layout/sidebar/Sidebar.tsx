import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProfile } from "./SidebarProfile";
import { navItems } from "./sidebarNavConfig";

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const [profileData, setProfileData] = useState<{
    id: string;
    full_name: string | null;
    display_name: string | null;
    business_name: string | null;
    account_type: "free" | "individual" | "business";
    avatar_url: string | null;
  } | null>(null);
  const { signOut } = useAuth();
  
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error("Error fetching profile:", error);
        } else {
          setProfileData(data);
        }
      }
    };
    
    fetchProfile();
  }, []);
  
  const renderNavItems = () => {
    // Get user role and staff status
    const userRole = localStorage.getItem('userRole');
    const isStaff = localStorage.getItem('isStaff') === 'true';
    
    return navItems
      .filter(item => {
        // Show items based on user account type or staff status
        if (isStaff && item.showFor.includes('staff')) {
          return true;
        }
        
        if (!isStaff && profileData && item.showFor.includes(profileData.account_type)) {
          return true;
        }
        
        return false;
      })
      .map((item) => (
        <li key={item.path}>
          <NavLink
            to={`/dashboard/${item.path}`}
            className={({ isActive }) => 
              `group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm ${
                isActive 
                  ? 'bg-accent text-accent-foreground' 
                  : 'hover:bg-muted'
              }`
            }
          >
            <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-2'}`} />
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && item.badge && (
              <Badge variant="secondary">{item.badge}</Badge>
            )}
          </NavLink>
        </li>
      ));
  };

  return (
    <div className="flex flex-col h-full space-y-4 py-4 border-r bg-secondary text-secondary-foreground">
      <SidebarProfile profileData={profileData} collapsed={collapsed} />
      <div className="flex-1 space-y-1">
        <ScrollArea className="h-full">
          <div className="space-y-1">
            <ul>
              {renderNavItems()}
            </ul>
          </div>
        </ScrollArea>
      </div>
      <div className="p-4">
        <Button variant="outline" className="w-full" onClick={signOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
