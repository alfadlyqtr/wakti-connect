
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  User,
  LogOut,
  MessageSquare,
  Users,
  HeartHandshake,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/integrations/supabase/client";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar = ({ toggleSidebar, isSidebarOpen }: NavbarProps) => {
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { 
      icon: MessageSquare, 
      label: 'Messages', 
      path: '/dashboard/messages', 
      badge: unreadMessages.length > 0 ? unreadMessages.length : null 
    },
    { 
      icon: Users, 
      label: 'Contacts', 
      path: '/dashboard/contacts', 
      badge: null 
    },
    { 
      icon: HeartHandshake, 
      label: 'Subscribers', 
      path: '/dashboard/subscribers', 
      badge: null,
      showForBusiness: true
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      path: '/dashboard/notifications', 
      badge: unreadNotifications.length > 0 ? unreadNotifications.length : null
    },
  ];

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
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-wakti-blue flex items-center justify-center">
              <span className="text-white font-bold">W</span>
            </div>
            <span className="font-bold text-lg hidden md:block">{t('common.wakti')}</span>
          </Link>
        </div>

        <div className={`absolute left-0 top-full w-full bg-background/95 backdrop-blur-md p-4 border-b border-border transition-all duration-300 ease-in-out lg:relative lg:top-auto lg:left-auto lg:w-auto lg:bg-transparent lg:p-0 lg:border-0 ${
          searchOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none lg:translate-y-0 lg:opacity-100 lg:pointer-events-auto"
        }`}>
          <div className="relative max-w-xl mx-auto lg:w-[400px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder={t('common.search')}
              className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none transition-all"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1 lg:hidden"
              onClick={() => setSearchOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSearchOpen(true)}
            className="lg:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Navigation Icons */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item, index) => {
              // Skip subscribers icon for non-business users
              if (item.showForBusiness && !localStorage.getItem('userRole')?.includes('business')) {
                return null;
              }
              
              return (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => navigate(item.path)}
                  aria-label={item.label}
                >
                  <item.icon className="h-5 w-5" />
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>

          <LanguageSwitcher />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="text-foreground hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-muted" aria-label="User menu">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Mobile menu items - only visible on small screens */}
              <div className="md:hidden">
                {navItems.map((item, index) => (
                  <DropdownMenuItem key={`mobile-${index}`} asChild>
                    <Link to={item.path} className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </div>
                      {item.badge && (
                        <Badge variant="destructive" className="ml-2">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </div>
              
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  {t('dashboard.settings')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isAuthenticated ? (
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('common.logOut')}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link to="/auth">{t('common.logIn')} / {t('common.signUp')}</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
