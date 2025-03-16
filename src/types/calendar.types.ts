
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: "task" | "appointment" | "booking";
}

export interface DayEventTypes {
  hasTasks: boolean;
  hasAppointments: boolean;
  hasBookings: boolean;
}
