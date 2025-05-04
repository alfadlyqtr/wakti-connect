
interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  isAllDay?: boolean;
}

/**
 * Creates a Google Calendar URL for an event
 */
export const createGoogleCalendarUrl = (event: CalendarEvent): string => {
  console.log("Creating Google Calendar URL for event:", event);
  
  const startDate = formatDateForGoogleCalendar(event.start, event.isAllDay);
  const endDate = formatDateForGoogleCalendar(event.end, event.isAllDay);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${startDate}/${endDate}`
  });
  
  const url = `https://calendar.google.com/calendar/render?${params.toString()}`;
  console.log("Generated Google Calendar URL:", url);
  
  return url;
};

/**
 * Creates and downloads an ICS file for calendar imports
 */
export const createICSFile = (event: CalendarEvent): void => {
  console.log("Creating ICS file for event:", event);
  
  const icsContent = generateICSContent(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  
  // Create link and trigger download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log("ICS file download triggered");
};

/**
 * Formats a date for Google Calendar URL
 */
const formatDateForGoogleCalendar = (date: Date, isAllDay?: boolean): string => {
  console.log("Formatting date for Google Calendar:", date, "isAllDay:", isAllDay);
  
  if (isAllDay) {
    return date.toISOString().replace(/[-:]/g, '').split('T')[0];
  }
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, '');
};

/**
 * Generates ICS file content
 */
const generateICSContent = (event: CalendarEvent): string => {
  console.log("Generating ICS content for event:", event);
  
  const formatICSDate = (date: Date, isAllDay?: boolean) => {
    if (isAllDay) {
      return date.toISOString().replace(/[-:]/g, '').split('T')[0];
    }
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, '');
  };
  
  const startDate = formatICSDate(event.start, event.isAllDay);
  const endDate = formatICSDate(event.end, event.isAllDay);
  
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
};
