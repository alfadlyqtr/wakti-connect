
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: EventType;
  status?: string;
  isCompleted?: boolean;
  priority?: string;
}

export type EventType = "task" | "booking";

export interface DayEventTypes {
  hasTasks: boolean;
  hasBookings?: boolean;
}
