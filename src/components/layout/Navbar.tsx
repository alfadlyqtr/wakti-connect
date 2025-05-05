
import React, { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { Separator } from "@/components/ui/separator";
import NotificationsDropdown from "@/components/notifications/NotificationsDropdown";
import { useAuth } from "@/features/auth/context/AuthContext";

// Import the components
import BrandLogo from "./navbar/BrandLogo";
import MobileSearch from "./navbar/MobileSearch";
import ThemeToggle from "./navbar/ThemeToggle";
import NavDateTime from "./navbar/NavDateTime";
import UserMenu from "./navbar/UserMenu";
import { UserRole } from "@/types/user";

// Import our command search component - removing the SearchButton import
import CommandSearch from "../search/CommandSearch";

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar = ({ toggleSidebar, isSidebarOpen }: NavbarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [commandSearchOpen, setCommandSearchOpen] = useState(false);
  const { isAuthenticated, effectiveRole } = useAuth();

  // Get unread notifications count
  const { data: unreadNotifications = [] } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_read', false);
        
      return data || [];
    },
    enabled: isAuthenticated,
  });

  // Get unread messages count
  const { data: unreadMessages = [] } = useQuery({
    queryKey: ['unreadMessages'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', session.user.id)
        .eq('is_read', false);
        
      return data || [];
    },
    enabled: isAuthenticated,
  });

  // Convert effectiveRole to userRole for compatibility
  const userRole = effectiveRole as UserRole;

  // Function to open command search dialog
  const openCommandSearch = () => {
    setCommandSearchOpen(true);
  };

  // Check if user is a staff member
  const isStaff = userRole === 'staff';

  return (
    <header className="w-full bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="lg:hidden"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          
          <BrandLogo />
        </div>

        {/* Only show search for business, individual, and free users - not for staff */}
        {!isStaff && (
          <>
            {/* Mobile search field */}
            <MobileSearch 
              searchOpen={searchOpen} 
              setSearchOpen={setSearchOpen} 
              openCommandSearch={openCommandSearch}
              userRole={userRole}
            />
          </>
        )}

        <div className="flex items-center gap-3">
          {/* Date and Time display - shown to everyone */}
          <NavDateTime className="mr-3 hidden md:block" />
          
          {/* Add a subtle separator before other icons (only visible on md+ screens) */}
          <Separator orientation="vertical" className="h-8 hidden md:block" />
          
          {/* Only show search button for business, individual, and free users - not for staff */}
          {!isStaff && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSearchOpen(true)}
              className="lg:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Language switcher - shown to everyone */}
          <LanguageSwitcher />

          {/* Theme toggle - shown to everyone and outside dropdown menu */}
          <ThemeToggle />

          {/* Notifications dropdown - shown to everyone */}
          {isAuthenticated && (
            <NotificationsDropdown />
          )}

          {/* User menu dropdown - contains all the navigation items now */}
          <UserMenu 
            unreadMessages={unreadMessages} 
            unreadNotifications={unreadNotifications}
          />
        </div>
      </div>

      {/* Command search dialog */}
      <CommandSearch 
        open={commandSearchOpen} 
        setOpen={setCommandSearchOpen}
        userRole={userRole}
      />
    </header>
  );
};

export default Navbar;
