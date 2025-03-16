
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Calendar,
  CheckSquare,
  MessageSquare,
  Bell,
  Users,
  Settings,
  UserCog,
  Clock,
  FileSpreadsheet,
  CreditCard,
  TrendingUp,
  Briefcase,
  Home,
  BarChart2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

// Define types for menu items
export interface SidebarMenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  roles: Array<"free" | "individual" | "business">;
  badge?: string | null;
}

interface SidebarNavItemsProps {
  userRole: "free" | "individual" | "business";
}

export const getMenuItems = (userRole: "free" | "individual" | "business", t: any): SidebarMenuItem[] => {
  const isPaidAccount = userRole === "individual" || userRole === "business";

  return [
    {
      title: t('dashboard.home'),
      icon: <Home size={20} />,
      path: "/dashboard",
      roles: ["free", "individual", "business"],
    },
    {
      title: t('dashboard.tasks'),
      icon: <CheckSquare size={20} />,
      path: "/dashboard/tasks",
      roles: ["free", "individual", "business"],
      badge: !isPaidAccount ? t('dashboard.viewOnly') : null,
    },
    {
      title: t('dashboard.appointments'),
      icon: <Calendar size={20} />,
      path: "/dashboard/appointments",
      roles: ["free", "individual", "business"],
      badge: !isPaidAccount ? t('dashboard.viewOnly') : null,
    },
    {
      title: t('dashboard.messages'),
      icon: <MessageSquare size={20} />,
      path: "/dashboard/messages",
      roles: ["individual", "business"],
    },
    {
      title: t('dashboard.notifications'),
      icon: <Bell size={20} />,
      path: "/dashboard/notifications",
      roles: ["free", "individual", "business"],
      badge: !isPaidAccount ? t('dashboard.viewOnly') : null,
    },
    {
      title: t('dashboard.contacts'),
      icon: <Users size={20} />,
      path: "/dashboard/contacts",
      roles: ["individual", "business"],
    },
    {
      title: t('dashboard.staffManagement'),
      icon: <UserCog size={20} />,
      path: "/dashboard/staff",
      roles: ["business"],
    },
    {
      title: t('dashboard.workLogs'),
      icon: <Clock size={20} />,
      path: "/dashboard/work-logs",
      roles: ["business"],
    },
    {
      title: t('dashboard.services'),
      icon: <Briefcase size={20} />,
      path: "/dashboard/services",
      roles: ["business"],
    },
    {
      title: t('dashboard.businessReports'),
      icon: <FileSpreadsheet size={20} />,
      path: "/dashboard/reports",
      roles: ["business"],
    },
    {
      title: t('dashboard.analytics'),
      icon: <TrendingUp size={20} />,
      path: "/dashboard/analytics",
      roles: ["business"],
    },
    {
      title: t('dashboard.billing'),
      icon: <CreditCard size={20} />,
      path: "/dashboard/billing",
      roles: ["free", "individual", "business"],
    },
    {
      title: t('dashboard.settings'),
      icon: <Settings size={20} />,
      path: "/dashboard/settings",
      roles: ["free", "individual", "business"],
    },
  ];
};

const SidebarNavItems: React.FC<SidebarNavItemsProps> = ({ userRole }) => {
  const { t } = useTranslation();
  
  // Filter items based on user role
  const filteredItems = getMenuItems(userRole, t).filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <ul className="space-y-1">
      {filteredItems.map((item, index) => (
        <li key={index}>
          <NavLink
            to={item.path}
            className={({ isActive }) => 
              cn("sidebar-item group", {
                "active": isActive,
              })
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="flex-1">{item.title}</span>
            {item.badge && (
              <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-500">
                {item.badge}
              </Badge>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default SidebarNavItems;
