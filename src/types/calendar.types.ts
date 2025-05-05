
import { TaskPriority } from "./task.types";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: EventType;
  status?: string;
  isCompleted?: boolean;
  priority?: TaskPriority; // Ensure we use TaskPriority consistently
  description?: string;
  location?: string;
}

export type EventType = "task" | "booking" | "event" | "manual";

export interface DayEventTypes {
  hasTasks: boolean;
  hasBookings?: boolean;
  hasEvents?: boolean;
  hasManualEntries?: boolean;
}

export interface ManualCalendarEntry {
  id: string;
  title: string;
  date: Date;
  description?: string;
  location?: string;
  user_id: string;
  created_at: string;
}
