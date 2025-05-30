
export interface DashboardWidgetLayout {
  id: string;
  order: number;
}

export interface DashboardLayoutItem {
  id: string;
  content: React.ReactNode;
  span: string;
}

export type WidgetType = 'tasks' | 'reminders' | 'bookings' | 'calendar' | 'subscribers' | 'analytics' | 'events' | 'profile';
