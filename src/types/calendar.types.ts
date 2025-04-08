
import { TaskPriority } from "./task.types";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: EventType;
  status?: string;
  isCompleted?: boolean;
  priority?: TaskPriority | string; // Use the TaskPriority type to ensure consistency
}

export type EventType = "task" | "booking";

export interface DayEventTypes {
  hasTasks: boolean;
  hasBookings?: boolean;
}
