
import { TaskPriority } from "./task.types";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: EventType;
  status?: string;
  isCompleted?: boolean;
  priority?: TaskPriority;
  location?: string;
  description?: string;
  start?: Date; // For events/bookings with specific times
  end?: Date;   // For events/bookings with specific times
  color?: string; // Custom color for the event
}

export type EventType = "task" | "booking" | "event" | "manual";

export interface DayEventTypes {
  hasTasks: boolean;
  hasBookings?: boolean;
  hasEvents?: boolean;
  hasManualEntries?: boolean;
}

export interface CalendarViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  view?: 'month' | 'week' | 'day';
  events?: CalendarEvent[];
}

export interface CalendarEntry {
  title: string;
  description?: string;
  location?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  isAllDay: boolean;
  color?: string;
}
