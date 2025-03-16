
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CalendarDays,
  CheckSquare,
  MessageSquare,
  Users,
  BarChart2,
  FileText,
  Briefcase,
  CreditCard,
  Settings,
  UserCircle,
  BellRing,
  Clock,
  Tag,
  UserCog,
  Globe,
  HeartHandshake
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  accountType: string;
}

const SidebarNavItems = ({ onNavClick }: { onNavClick?: () => void }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = React.useState(0);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('account_type')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error("Error fetching user data:", error);
          } else if (data) {
            setUserData({ accountType: data.account_type });
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const isActive = (path: string) => {
    return location.pathname.startsWith('/dashboard/' + path);
  };

  const isBusinessUser = userData?.accountType === 'business';

  const handleNavClick = (path: string) => {
    // Invalidate specific queries based on the route
    if (path === 'messages') {
      queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
    }
    
    if (onNavClick) {
      onNavClick();
    }
  };

  const navItems = [
    { 
      path: '', 
      label: 'Dashboard', 
      icon: <BarChart2 className="h-5 w-5" />,
      showFor: ['free', 'individual', 'business'] 
    },
    { 
      path: 'tasks', 
      label: 'Tasks', 
      icon: <CheckSquare className="h-5 w-5" />, 
      showFor: ['free', 'individual', 'business'] 
    },
    { 
      path: 'appointments', 
      label: 'Appointments', 
      icon: <CalendarDays className="h-5 w-5" />, 
      showFor: ['free', 'individual', 'business'] 
    },
    { 
      path: 'messages', 
      label: 'Messages', 
      icon: <MessageSquare className="h-5 w-5" />, 
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
      showFor: ['free', 'individual', 'business'] 
    },
    { 
      path: 'contacts', 
      label: 'Contacts', 
      icon: <Users className="h-5 w-5" />, 
      showFor: ['free', 'individual', 'business'] 
    },
    // Business sections
    { 
      section: 'Business',
      showFor: ['business']
    },
    { 
      path: 'business-page', 
      label: 'Landing Page', 
      icon: <Globe className="h-5 w-5" />, 
      showFor: ['business'] 
    },
    { 
      path: 'subscribers', 
      label: 'Subscribers', 
      icon: <HeartHandshake className="h-5 w-5" />, 
      showFor: ['business'] 
    },
    { 
      path: 'analytics', 
      label: 'Analytics', 
      icon: <BarChart2 className="h-5 w-5" />, 
      showFor: ['business'] 
    },
    { 
      path: 'reports', 
      label: 'Reports', 
      icon: <FileText className="h-5 w-5" />, 
      showFor: ['business'] 
    },
    { 
      path: 'staff', 
      label: 'Staff', 
      icon: <UserCog className="h-5 w-5" />, 
      showFor: ['business'] 
    },
    { 
      path: 'services', 
      label: 'Services', 
      icon: <Tag className="h-5 w-5" />, 
      showFor: ['business'] 
    },
    { 
      path: 'jobs', 
      label: 'Jobs', 
      icon: <Briefcase className="h-5 w-5" />, 
      showFor: ['business'] 
    },
    { 
      path: 'job-cards', 
      label: 'Job Cards', 
      icon: <FileText className="h-5 w-5" />, 
      showFor: ['business'] 
    },
    { 
      path: 'work-logs', 
      label: 'Work Logs', 
      icon: <Clock className="h-5 w-5" />, 
      showFor: ['business'] 
    },
    
    // Account section
    { 
      section: 'Account',
      showFor: ['free', 'individual', 'business']
    },
    { 
      path: 'billing', 
      label: 'Billing', 
      icon: <CreditCard className="h-5 w-5" />, 
      showFor: ['free', 'individual', 'business'] 
    },
    { 
      path: 'profile', 
      label: 'Profile', 
      icon: <UserCircle className="h-5 w-5" />, 
      showFor: ['free', 'individual', 'business'] 
    },
    { 
      path: 'notifications', 
      label: 'Notifications', 
      icon: <BellRing className="h-5 w-5" />, 
      showFor: ['free', 'individual', 'business'] 
    },
    { 
      path: 'settings', 
      label: 'Settings', 
      icon: <Settings className="h-5 w-5" />, 
      showFor: ['free', 'individual', 'business'] 
    }
  ];

  return (
    <div className="flex flex-col gap-2 p-2">
      {navItems.map((item, index) => {
        // Skip if section or item should not be shown for current user type
        if (userData && item.showFor && !item.showFor.includes(userData.accountType)) {
          return null;
        }

        // Section header
        if ('section' in item) {
          return (
            <div key={`section-${index}`} className="mt-6 mb-2">
              <Separator className="mb-2" />
              <p className="px-2 text-xs font-semibold text-muted-foreground">
                {item.section}
              </p>
            </div>
          );
        }

        // Navigation item
        return (
          <Button
            key={item.path}
            variant={isActive(item.path) ? "secondary" : "ghost"}
            size={isMobile ? "icon" : "default"}
            asChild
            className={cn(
              "justify-start",
              isMobile && "h-12 w-12"
            )}
            onClick={() => handleNavClick(item.path)}
          >
            <Link to={`/dashboard/${item.path}`}>
              {item.icon}
              {!isMobile && (
                <span className="ml-2">{item.label}</span>
              )}
              {item.badge && !isMobile && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Link>
          </Button>
        );
      })}
    </div>
  );
};

export default SidebarNavItems;
