
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SidebarNavItem } from "@/types";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SidebarProps {
  navigation: SidebarNavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ navigation }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data;
    },
  });

  const handleLogout = async () => {
    await logout();
  };

  const isAccountTypeAllowed = (requiredType: string, userType?: string) => {
    if (!userType) return false;
    if (requiredType === 'any') return true;
    
    // Handle account types
    return ['free', 'individual', 'business'].includes(requiredType) && 
           (userType === requiredType || userType === 'business');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 data-[state=open]:bg-transparent focus:bg-transparent hover:bg-transparent md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-64">
        <SheetHeader className="space-y-2.5">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navigate through your available options.
          </SheetDescription>
        </SheetHeader>
        
        {/* Profile section */}
        <div className="py-4">
          {isLoading ? (
            <div className="h-16 animate-pulse bg-muted rounded w-full"></div>
          ) : profileData ? (
            <div className="p-3 border rounded-md">
              <div className="font-medium">{profileData.display_name || profileData.full_name}</div>
              <div className="text-sm text-muted-foreground">{profileData.account_type}</div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Could not load profile data.
            </p>
          )}
        </div>

        {/* Search section */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-background border rounded-md py-2 px-3 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {navigation.map((item) =>
            isAccountTypeAllowed(item.accountType, profileData?.account_type) ? (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center text-sm font-medium py-2 px-3 rounded-md outline-none transition-colors ${
                    isActive
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {item.title}
              </NavLink>
            ) : null
          )}
        </div>

        <SheetTitle className="mt-6">Settings</SheetTitle>
        <div className="grid gap-4 mt-2">
          <Button variant="ghost" className="justify-start" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
