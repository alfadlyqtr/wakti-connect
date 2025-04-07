
import React, { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

// Import the components
import BrandLogo from "./navbar/BrandLogo";
import MobileSearch from "./navbar/MobileSearch";
import NavItems from "./navbar/NavItems";
import UserMenu from "./navbar/UserMenu";
import ThemeToggle from "./navbar/ThemeToggle";
import NavDateTime from "./navbar/NavDateTime";

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar = ({ toggleSidebar, isSidebarOpen }: NavbarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

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
  });

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };

    checkAuth();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className={`w-full bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 ${isRTL ? 'rtl' : ''}`}>
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

        <MobileSearch searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

        <div className="flex items-center gap-3">
          {/* Date and Time display */}
          <NavDateTime className="mr-3 hidden md:block" />
          
          {/* Add a subtle separator before other icons (only visible on md+ screens) */}
          <Separator orientation="vertical" className="h-8 hidden md:block" />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSearchOpen(true)}
            className="lg:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Navigation Icons - show on all screen sizes now */}
          <NavItems 
            unreadMessages={unreadMessages} 
            unreadNotifications={unreadNotifications} 
          />

          <LanguageSwitcher />

          <ThemeToggle />

          <UserMenu 
            isAuthenticated={isAuthenticated} 
            unreadMessages={unreadMessages} 
            unreadNotifications={unreadNotifications} 
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
