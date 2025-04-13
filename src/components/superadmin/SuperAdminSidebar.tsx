
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Users, ShieldAlert, Database, BarChart3, 
  Settings, FileText, Bell, DollarSign, 
  Layout, Zap, ClipboardList, Bot, Wrench,
  AlertTriangle, BookOpen, ChevronRight, ChevronLeft,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SuperAdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({ 
  isOpen, 
  onToggle 
}) => {
  const navigate = useNavigate();
  
  const navGroups: NavGroup[] = [
    {
      title: "User Management",
      items: [
        { icon: Users, label: "Users", path: "/gohabsgo/users" },
        { icon: ShieldAlert, label: "Security", path: "/gohabsgo/security" },
      ]
    },
    {
      title: "Business",
      items: [
        { icon: Database, label: "Businesses", path: "/gohabsgo/businesses" },
        { icon: DollarSign, label: "Financials", path: "/gohabsgo/financial" },
      ]
    },
    {
      title: "Content & System",
      items: [
        { icon: FileText, label: "Content", path: "/gohabsgo/content" },
        { icon: Settings, label: "Configuration", path: "/gohabsgo/system" },
        { icon: Layout, label: "Architecture", path: "/gohabsgo/architecture" },
      ]
    },
    {
      title: "Analytics & AI",
      items: [
        { icon: BarChart3, label: "Analytics", path: "/gohabsgo/analytics" },
        { icon: Bot, label: "AI Control", path: "/gohabsgo/ai-control" },
        { icon: Zap, label: "Experiments", path: "/gohabsgo/experiments" },
      ]
    },
    {
      title: "Compliance & Support",
      items: [
        { icon: BookOpen, label: "Compliance", path: "/gohabsgo/compliance" },
        { icon: Bell, label: "Inbox", path: "/gohabsgo/inbox" },
        { icon: Wrench, label: "Developer", path: "/gohabsgo/developer" },
        { icon: AlertTriangle, label: "Emergency", path: "/gohabsgo/emergency" },
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('isSuperAdmin');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate('/auth/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out",
        variant: "destructive"
      });
    }
  };

  return (
    <aside className={cn(
      "bg-[#0a0a0a] border-r border-gray-800 h-screen sticky top-16 transition-all duration-300",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="flex justify-end p-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
          className="text-gray-500"
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-10rem)] px-2">
        {navGroups.map((group, index) => (
          <div key={index} className="mb-4">
            {isOpen && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                {group.title}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                    isActive 
                      ? "bg-red-900/20 text-red-400" 
                      : "text-gray-400 hover:bg-gray-800 hover:text-gray-300",
                    !isOpen && "justify-center px-1"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", isOpen ? "mr-2" : "")} />
                  {isOpen && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
            {isOpen && index < navGroups.length - 1 && (
              <Separator className="bg-gray-800 my-4" />
            )}
          </div>
        ))}
      </ScrollArea>
      
      {/* Logout button at bottom of sidebar */}
      <div className="absolute bottom-4 left-0 right-0 px-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={cn(
            "w-full text-red-400 hover:bg-red-900/20 hover:text-red-300 flex items-center",
            !isOpen && "justify-center px-1"
          )}
        >
          <LogOut className={cn("h-5 w-5 flex-shrink-0", isOpen ? "mr-2" : "")} />
          {isOpen && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default SuperAdminSidebar;
