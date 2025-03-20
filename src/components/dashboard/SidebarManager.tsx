
import React, { useEffect } from "react";
import { useIsMobile } from "@/hooks/useResponsive";
import { useLocation } from "react-router-dom";

interface SidebarManagerProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}

const SidebarManager: React.FC<SidebarManagerProps> = ({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  children 
}) => {
  const isMobile = useIsMobile();
  const location = useLocation();

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isSidebarOpen) {
        const sidebar = document.getElementById('sidebar');
        const navbarToggle = document.getElementById('sidebar-toggle');
        
        if (sidebar && 
            !sidebar.contains(event.target as Node) && 
            navbarToggle && 
            !navbarToggle.contains(event.target as Node)) {
          setIsSidebarOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isSidebarOpen, setIsSidebarOpen]);

  // Close sidebar on navigation when on mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile, isSidebarOpen, setIsSidebarOpen]);

  return <>{children}</>;
};

export default SidebarManager;
