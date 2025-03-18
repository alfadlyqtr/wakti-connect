
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  CheckSquare, 
  MessageSquare, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  Store,
  Bell,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useRtl } from "@/hooks/useRtl";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const { t } = useTranslation();
  const isRtl = useRtl();
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Sidebar navigation items
  const navItems = [
    { 
      name: t('dashboard.home'), 
      path: "/dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: t('dashboard.tasks'), 
      path: "/dashboard/tasks", 
      icon: <CheckSquare className="h-5 w-5" /> 
    },
    { 
      name: t('dashboard.messages'), 
      path: "/dashboard/messages", 
      icon: <MessageSquare className="h-5 w-5" /> 
    },
    { 
      name: t('dashboard.contacts'), 
      path: "/dashboard/contacts", 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: t('dashboard.appointments'), 
      path: "/dashboard/appointments", 
      icon: <Calendar className="h-5 w-5" /> 
    },
    { 
      name: t('dashboard.notifications'), 
      path: "/dashboard/notifications", 
      icon: <Bell className="h-5 w-5" /> 
    }
  ];
  
  // Business-related navigation items
  const businessItems = [
    { 
      name: t('dashboard.staffManagement'), 
      path: "/dashboard/staff", 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: t('dashboard.workLogs'), 
      path: "/dashboard/work-logs", 
      icon: <CheckSquare className="h-5 w-5" /> 
    },
    { 
      name: t('dashboard.services'), 
      path: "/dashboard/services", 
      icon: <Store className="h-5 w-5" /> 
    },
    { 
      name: t('dashboard.businessReports'), 
      path: "/dashboard/reports", 
      icon: <BarChart3 className="h-5 w-5" /> 
    }
  ];
  
  // Settings and analytics
  const bottomItems = [
    { 
      name: t('dashboard.analytics'), 
      path: "/dashboard/analytics", 
      icon: <BarChart3 className="h-5 w-5" /> 
    },
    { 
      name: t('dashboard.billing'), 
      path: "/dashboard/billing", 
      icon: <CreditCard className="h-5 w-5" /> 
    },
    { 
      name: t('dashboard.settings'), 
      path: "/dashboard/settings", 
      icon: <Settings className="h-5 w-5" /> 
    }
  ];

  return (
    <aside
      className={`fixed top-16 h-[calc(100vh-64px)] z-40 transition-all duration-300 ${
        isOpen ? "w-64" : "w-0"
      } ${isRtl ? 'right-0' : 'left-0'} bg-background border-r overflow-hidden`}
    >
      <div className="h-full px-4 py-4 flex flex-col">
        <div className="flex items-center justify-end mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={`${isRtl ? "rotate-180" : ""}`}
          >
            {isRtl ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
        
        <div className="mt-8">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            {t('dashboard.business')}
          </h3>
          <div className="space-y-1">
            {businessItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="space-y-1">
            {bottomItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
