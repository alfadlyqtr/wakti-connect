
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CommandIcon, Search } from 'lucide-react';
import { UserRole } from '@/types/user';
import { shouldHideMenuItem } from '@/utils/menuItemUtils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { navItems } from '@/config/navItems';

interface SidebarNavItemsProps {
  onNavClick?: () => void;
  isCollapsed?: boolean;
  openCommandSearch?: () => void;
}

const SidebarNavItems: React.FC<SidebarNavItemsProps> = ({
  onNavClick,
  isCollapsed = false,
  openCommandSearch,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = (localStorage.getItem('userRole') as UserRole) || 'free';

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onNavClick) {
      onNavClick();
    }
  };

  return (
    <div className="space-y-1 py-2">
      {openCommandSearch && (
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start px-2",
            isCollapsed ? "justify-center" : "px-2"
          )}
          onClick={openCommandSearch}
        >
          <Search className="h-4 w-4 mr-2" />
          {!isCollapsed && <span>Search</span>}
        </Button>
      )}

      {navItems.map((item) => {
        // Skip this menu item if it should be hidden for current user role
        if (shouldHideMenuItem(item.href, userRole)) {
          return null;
        }

        const isActive = location.pathname === item.href;
        const Icon = item.icon; // Get the icon component

        return (
          <Button
            key={item.href}
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              isCollapsed ? "justify-center" : "px-2"
            )}
            onClick={() => handleNavigation(item.href)}
          >
            <Icon className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">{item.label}</span>}
          </Button>
        );
      })}
    </div>
  );
};

export default SidebarNavItems;
