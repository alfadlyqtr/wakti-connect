
import { BarChart2, Bell, BookOpen, Calendar, CreditCard, FileText, Home, Mail, MenuIcon, MessageSquare, Settings, ShieldCheck, Users, Clock, Briefcase, FileCheck, User, Palette, Store, UserPlus, Globe } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  plans?: Array<"free" | "individual" | "business">;
  roles?: Array<"admin" | "co-admin" | "staff" | null>;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: <User className="h-5 w-5" />,
  },
  {
    title: "Tasks",
    href: "/dashboard/tasks",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Appointments",
    href: "/dashboard/appointments",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Contacts",
    href: "/dashboard/contacts",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: <Bell className="h-5 w-5" />,
  },
  // Business plan specific
  {
    title: "Landing Page",
    href: "/dashboard/business-page",
    icon: <Globe className="h-5 w-5" />,
    plans: ["business"],
    roles: ["admin", "co-admin"]
  },
  {
    title: "Subscribers",
    href: "/dashboard/subscribers",
    icon: <UserPlus className="h-5 w-5" />,
    plans: ["business"],
    roles: ["admin", "co-admin", "staff"]
  },
  {
    title: "Service Management",
    href: "/dashboard/service-management",
    icon: <BookOpen className="h-5 w-5" />,
    plans: ["business"],
    roles: ["admin", "co-admin"]
  },
  {
    title: "Jobs",
    href: "/dashboard/jobs",
    icon: <Briefcase className="h-5 w-5" />,
    plans: ["business"],
    roles: ["admin", "co-admin"]
  },
  {
    title: "Job Cards",
    href: "/dashboard/job-cards",
    icon: <FileCheck className="h-5 w-5" />,
    plans: ["business"],
    roles: ["admin", "co-admin", "staff"]
  },
  {
    title: "Staff Management",
    href: "/dashboard/staff",
    icon: <Users className="h-5 w-5" />,
    plans: ["business"],
    roles: ["admin", "co-admin"]
  },
  {
    title: "Work Logs",
    href: "/dashboard/work-logs",
    icon: <Clock className="h-5 w-5" />,
    plans: ["business"],
    roles: ["admin", "co-admin"]
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart2 className="h-5 w-5" />,
    plans: ["business"],
    roles: ["admin", "co-admin"]
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: <ShieldCheck className="h-5 w-5" />,
    plans: ["business"],
    roles: ["admin", "co-admin"]
  },
  // General
  {
    title: "Appearance",
    href: "/dashboard/appearance",
    icon: <Palette className="h-5 w-5" />,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

interface SidebarNavItemsProps {
  userRole?: "free" | "individual" | "business";
  staffRole?: "admin" | "co-admin" | "staff" | null;
}

const SidebarNavItems: React.FC<SidebarNavItemsProps> = ({ 
  userRole = "free", 
  staffRole = null 
}) => {
  // Filter items based on the user's role and plan
  const filteredItems = navItems.filter(item => {
    // If the item has plans specified, check if the user's plan is included
    if (item.plans && !item.plans.includes(userRole)) {
      return false;
    }
    
    // If the item has roles specified, check if the user's role is included
    if (item.roles && staffRole && !item.roles.includes(staffRole)) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-1">
      {filteredItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.href}
          className={({ isActive }) => cn(
            "flex items-center rounded-md px-3 py-2 text-sm",
            "hover:bg-accent hover:text-accent-foreground",
            isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
          )}
        >
          <span className="mr-3">{item.icon}</span>
          <span>{item.title}</span>
        </NavLink>
      ))}
    </div>
  );
};

export { navItems, SidebarNavItems };
export type { NavItem };
