
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
  { 
    path: 'messages', 
    label: 'Messages', 
    icon: MessageSquare, 
    showFor: ['free', 'individual', 'business'] 
  },
  { 
    path: 'contacts', 
    label: 'Contacts', 
    icon: Users, 
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
    path: 'subscribers', 
    label: 'Subscribers', 
    icon: HeartHandshake, 
    showFor: ['business'] 
  },
  { 
    path: 'analytics', 
    label: 'Analytics', 
    icon: BarChart2, 
    showFor: ['business'] 
  },
  { 
    path: 'reports', 
    label: 'Reports', 
    icon: FileText, 
    showFor: ['business'] 
  },
  { 
    path: 'staff', 
    label: 'Staff', 
    icon: UserCog, 
    showFor: ['business'] 
  },
  { 
    path: 'services', 
    label: 'Services', 
    icon: Tag, 
    showFor: ['business'] 
  },
  { 
    path: 'jobs', 
    label: 'Jobs', 
    icon: Briefcase, 
    showFor: ['business'] 
  },
  { 
    path: 'job-cards', 
    label: 'Job Cards', 
    icon: FileText, 
    showFor: ['business'] 
  },
  { 
    path: 'work-logs', 
    label: 'Work Logs', 
    icon: Clock, 
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
    icon: CreditCard, 
    showFor: ['free', 'individual', 'business'] 
  },
  { 
    path: 'profile', 
    label: 'Profile', 
    icon: UserCircle, 
    showFor: ['free', 'individual', 'business'] 
  },
  { 
    path: 'notifications', 
    label: 'Notifications', 
    icon: BellRing, 
    showFor: ['free', 'individual', 'business'] 
  },
  { 
    path: 'settings', 
    label: 'Settings', 
    icon: Settings, 
    showFor: ['free', 'individual', 'business'] 
  }
];
