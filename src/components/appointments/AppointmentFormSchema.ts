
import * as z from "zod";

export interface AppointmentFormValues {
  title: string;
  description: string;
  location: string;
  date: Date;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
}

// Default values for the appointment form
export const getDefaultFormValues = (): AppointmentFormValues => {
  const today = new Date();
  
  return {
    title: "",
    description: "",
    location: "",
    date: today,
    startTime: getNextHourTimeString(today),
    endTime: getNextHourPlusOneTimeString(today),
    isAllDay: false
  };
};

// Helper functions for time formatting
function getNextHourTimeString(date: Date): string {
  const nextHour = new Date(date);
  nextHour.setHours(nextHour.getHours() + 1, 0, 0);
  return `${String(nextHour.getHours()).padStart(2, "0")}:${String(nextHour.getMinutes()).padStart(2, "0")}`;
}

function getNextHourPlusOneTimeString(date: Date): string {
  const nextHourPlusOne = new Date(date);
  nextHourPlusOne.setHours(nextHourPlusOne.getHours() + 2, 0, 0);
  return `${String(nextHourPlusOne.getHours()).padStart(2, "0")}:${String(nextHourPlusOne.getMinutes()).padStart(2, "0")}`;
}
