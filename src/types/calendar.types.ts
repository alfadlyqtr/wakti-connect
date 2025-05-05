
import { TaskPriority } from "./task.types";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: EventType;
  status?: string;
  isCompleted?: boolean;
  priority?: TaskPriority; // Ensure we use TaskPriority consistently
  location?: string; // Optional location for events
  description?: string; // Optional description for events
  startTime?: string; // Optional start time for time-specific events
  endTime?: string; // Optional end time for time-specific events
}

export type EventType = "task" | "booking" | "event"; // Added "event" type

export interface DayEventTypes {
  hasTasks: boolean;
  hasBookings?: boolean;
  hasEvents?: boolean; // Added hasEvents property
}
