
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import { useTheme } from "@/hooks/use-theme";
import { useSidebarToggle } from "@/hooks/useSidebarToggle";
import { cn } from "@/lib/utils";
import { Menu, Moon, Sun, Bell, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { getInitials } from "@/utils/string-utils";
import { useTranslationContext } from "@/contexts/TranslationContext";
import LanguageSwitcher from "@/components/ui/language-switcher";

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { pathname } = useLocation();
  const { data: profileData } = useProfileSettings();
  const { t, isRTL } = useTranslationContext();
  
  // Check if we're on a public page (not dashboard)
  const isPublicPage = !pathname.includes("/dashboard");
  
  // Get user's profile image if available
  const profileImage = profileData?.avatar_url || null;
  
  // Get user's name or email for the avatar fallback
  const userDisplayName = profileData?.full_name || profileData?.display_name || user?.email || "User";
  
  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  return (
    <header className={cn(
      "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      isRTL ? "rtl" : ""
    )}>
      <div className="container flex h-14 items-center">
        <div className="flex items-center justify-between w-full gap-2">
          {/* Left side - Logo and menu toggle */}
          <div className="flex items-center">
            {!isPublicPage && (
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={toggleSidebar}
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
            
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
                alt="Wakti Logo" 
                className="h-8 w-8"
              />
              <span className="font-bold text-xl hidden sm:inline-block">Wakti</span>
            </Link>
          </div>
          
          {/* Right side - Theme toggle, notifications, user menu */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            {/* Notifications - only show when logged in */}
            {user && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative"
              >
                <Link to="/dashboard/notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </Link>
              </Button>
            )}
            
            {/* User menu or login button */}
            {user ? (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard/settings">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profileImage || undefined} alt={userDisplayName} />
                    <AvatarFallback>{getInitials(userDisplayName)}</AvatarFallback>
                  </Avatar>
                </Link>
              </Button>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/auth/login">{t("header.signIn")}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
