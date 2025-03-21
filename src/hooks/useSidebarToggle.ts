
import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

export function useSidebarToggle() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
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
  }, [isMobile, isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return {
    isSidebarOpen,
    toggleSidebar,
    isMobile
  };
}
