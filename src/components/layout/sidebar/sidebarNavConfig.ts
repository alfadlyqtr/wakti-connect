
import {
  CalendarDays,
  CheckSquare,
  BarChart2,
  Settings,
  UserCircle,
  Globe,
  Briefcase,
  UserCog,
  CreditCard,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  badge?: number | null;
  showFor: Array<'free' | 'individual' | 'business'>;
}

export interface NavSection {
  section: string;
  showFor: Array<'free' | 'individual' | 'business'>;
}

export type SidebarNavItemType = NavItem | NavSection;

export const navItems: SidebarNavItemType[] = [
  { 
    path: '', 
    label: 'Dashboard', 
    icon: BarChart2,
    showFor: ['free', 'individual', 'business'] 
  },
  { 
    path: 'tasks', 
    label: 'Tasks', 
    icon: CheckSquare, 
    showFor: ['free', 'individual', 'business'] 
  },
  { 
    path: 'appointments', 
    label: 'Appointments', 
    icon: CalendarDays, 
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
    icon: Globe, 
    showFor: ['business'] 
  },
  { 
    path: 'analytics-hub', 
    label: 'Analytics Hub', 
    icon: BarChart2, 
    showFor: ['business'] 
  },
  { 
    path: 'team-management', 
    label: 'Team Management', 
    icon: UserCog, 
    showFor: ['business'] 
  },
  { 
    path: 'work-management', 
    label: 'Work Management', 
    icon: Briefcase, 
    showFor: ['business'] 
  },
  { 
    path: 'services', 
    label: 'Services', 
    icon: CreditCard, 
    showFor: ['business'] 
  },
  
  // Account section
  { 
    section: 'Account',
    showFor: ['free', 'individual', 'business']
  },
  { 
    path: 'settings', 
    label: 'Settings', 
    icon: Settings, 
    showFor: ['free', 'individual', 'business'] 
  }
];
