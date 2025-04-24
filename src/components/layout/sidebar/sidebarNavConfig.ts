
import { Home, MessageSquare, Calendar, Users, Bell, Clock, Settings, HeartHandshake, 
  LayoutDashboard, ListChecks, KanbanSquare, HelpCircle, Building2, Store,
  UserPlus, PartyPopper, BarChart2, FileText, Bot, Headphones, Mic } from "lucide-react";
import { UserRole } from "@/types/user";

export type NavItem = {
  icon: any; 
  label: string;
  path: string;
  showFor: UserRole[];
  badge?: number | null;
};

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "",
    icon: LayoutDashboard,
    showFor: ['individual', 'business', 'staff', 'super-admin'],
  },
  {
    label: "Tasks",
    path: "tasks",
    icon: ListChecks,
    showFor: ['individual', 'business', 'staff', 'super-admin'],
  },
  {
    label: "Events",
    path: "events",
    icon: PartyPopper,
    showFor: ['individual', 'business', 'staff', 'super-admin'],
  },
  {
    label: "Bookings",
    path: "bookings",
    icon: Calendar,
    showFor: ['business', 'staff', 'super-admin'],
  },
  {
    label: "Jobs",
    path: "jobs",
    icon: KanbanSquare,
    showFor: ['business', 'super-admin'],
  },
  {
    label: "Job Cards",
    path: "job-cards",
    icon: FileText,
    showFor: ['staff', 'super-admin'],
  },
  {
    label: "Services",
    path: "services",
    icon: Store,
    showFor: ['business', 'super-admin'],
  },
  {
    label: "Staff",
    path: "staff",
    icon: UserPlus,
    showFor: ['business', 'super-admin'],
  },
  {
    label: "Business Page",
    path: "business-page",
    icon: Building2,
    showFor: ['business', 'super-admin'],
  },
  {
    label: "Analytics",
    path: "analytics",
    icon: BarChart2,
    showFor: ['business', 'super-admin'],
  },
  {
    label: "Reports",
    path: "reports",
    icon: FileText,
    showFor: ['business', 'super-admin'],
  },
  {
    label: "WAKTI AI",
    path: "ai-assistant",
    icon: Bot,
    showFor: ['individual', 'business', 'staff', 'super-admin'],
  },
  {
    label: "Settings",
    path: "settings",
    icon: Settings,
    showFor: ['individual', 'business', 'staff', 'super-admin'],
  },
  {
    label: "Help",
    path: "help",
    icon: HelpCircle,
    showFor: ['individual', 'business', 'staff', 'super-admin'],
  },
  {
    label: "Staff Communication",
    path: "staff-communication",
    icon: Headphones,
    showFor: ['staff', 'super-admin'],
  },
  {
    label: "Voice Recorder & Transcription",
    path: "meeting-summary",
    icon: Mic,
    showFor: ['individual', 'business', 'staff', 'super-admin'],
  },
];

export const dropdownNavItems: NavItem[] = [
  {
    icon: Bell,
    label: 'Notifications',
    path: 'notifications',
    showFor: ['individual', 'business', 'staff'],
    badge: 0
  },
  {
    icon: Users,
    label: 'Contacts',
    path: 'contacts',
    showFor: ['individual', 'business', 'staff']
  },
  {
    icon: HeartHandshake,
    label: 'Subscribers',
    path: 'subscribers',
    showFor: ['business']
  },
  {
    icon: MessageSquare,
    label: 'Messages',
    path: 'messages',
    showFor: ['individual', 'business', 'staff']
  },
  {
    icon: Calendar,
    label: 'Calendar',
    path: 'calendar',
    showFor: ['individual', 'business', 'staff']
  },
  {
    icon: Clock,
    label: 'Time Tracking',
    path: 'time-tracking',
    showFor: ['individual', 'business', 'staff']
  },
  {
    icon: Settings,
    label: 'Settings',
    path: 'settings',
    showFor: ['individual', 'business', 'staff']
  },
];
