
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Calendar,
  CheckSquare,
  MessageSquare,
  Bell,
  Users,
  Settings,
  Crown,
  Home,
  BarChart2,
  UserCog,
  Clock,
  FileSpreadsheet,
  CreditCard,
  TrendingUp,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  userRole?: "free" | "individual" | "business";
}

const Sidebar = ({ isOpen, userRole = "free" }: SidebarProps) => {
  const isPaidAccount = userRole === "individual" || userRole === "business";

  // Define menu items based on user role
  const menuItems = [
    {
      title: "Home",
      icon: <Home size={20} />,
      path: "/dashboard",
      roles: ["free", "individual", "business"],
    },
    {
      title: "Tasks",
      icon: <CheckSquare size={20} />,
      path: "/dashboard/tasks",
      roles: ["free", "individual", "business"],
      badge: !isPaidAccount ? "View Only" : null,
    },
    {
      title: "Appointments",
      icon: <Calendar size={20} />,
      path: "/dashboard/appointments",
      roles: ["free", "individual", "business"],
      badge: !isPaidAccount ? "View Only" : null,
    },
    {
      title: "Messages",
      icon: <MessageSquare size={20} />,
      path: "/dashboard/messages",
      roles: ["individual", "business"],
    },
    {
      title: "Notifications",
      icon: <Bell size={20} />,
      path: "/dashboard/notifications",
      roles: ["free", "individual", "business"],
      badge: !isPaidAccount ? "View Only" : null,
    },
    {
      title: "Contacts",
      icon: <Users size={20} />,
      path: "/dashboard/contacts",
      roles: ["individual", "business"],
    },
    {
      title: "Staff Management",
      icon: <UserCog size={20} />,
      path: "/dashboard/staff",
      roles: ["business"],
    },
    {
      title: "Work Logs",
      icon: <Clock size={20} />,
      path: "/dashboard/work-logs",
      roles: ["business"],
    },
    {
      title: "Services",
      icon: <Briefcase size={20} />,
      path: "/dashboard/services",
      roles: ["business"],
    },
    {
      title: "Business Reports",
      icon: <FileSpreadsheet size={20} />,
      path: "/dashboard/reports",
      roles: ["business"],
    },
    {
      title: "Analytics",
      icon: <TrendingUp size={20} />,
      path: "/dashboard/analytics",
      roles: ["business"],
    },
    {
      title: "Billing & Subscription",
      icon: <CreditCard size={20} />,
      path: "/dashboard/billing",
      roles: ["free", "individual", "business"],
    },
    {
      title: "Settings",
      icon: <Settings size={20} />,
      path: "/dashboard/settings",
      roles: ["free", "individual", "business"],
    },
  ];

  // Filter items based on user role
  const filteredItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 w-64 bg-sidebar z-40 border-r border-border transition-transform duration-300 ease-in-out transform",
        {
          "translate-x-0": isOpen,
          "-translate-x-full": !isOpen,
        },
        "lg:translate-x-0" // Always visible on large screens
      )}
    >
      <div className="h-full flex flex-col">
        <div className="px-6 py-6">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <span>Wakti</span>
            {userRole === "free" && (
              <Badge variant="outline" className="text-xs bg-wakti-gold/10 text-wakti-gold">
                Free
              </Badge>
            )}
            {userRole === "individual" && (
              <Badge variant="outline" className="text-xs bg-wakti-blue/10 text-wakti-blue">
                Individual
              </Badge>
            )}
            {userRole === "business" && (
              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500">
                Business
              </Badge>
            )}
          </h2>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3">
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
        </nav>
        
        {userRole === "free" && (
          <div className="px-4 py-6 mt-auto">
            <div className="p-4 rounded-lg bg-gradient-to-r from-wakti-blue to-blue-600 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Crown size={18} />
                <h3 className="font-semibold">Upgrade Now</h3>
              </div>
              <p className="text-sm opacity-90 mb-3">
                Get full access to all features and unlock premium benefits.
              </p>
              <Button 
                size="sm" 
                className="w-full bg-white hover:bg-white/90 text-wakti-blue"
                asChild
              >
                <NavLink to="/dashboard/upgrade">
                  Upgrade Plan
                </NavLink>
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
