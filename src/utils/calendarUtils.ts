
// Calendar utility functions

interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  isAllDay: boolean;
}

/**
 * Create a URL for adding an event to Google Calendar
 */
export function createGoogleCalendarUrl(event: CalendarEvent): string {
  // Format dates for Google Calendar
  // Google Calendar uses YYYYMMDDTHHMMSSZ format
  const formatGoogleDate = (date: Date, isAllDay: boolean) => {
    if (isAllDay) {
      return date.toISOString().replace(/-|:|\.\d+/g, '').split('T')[0];
    }
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };
  
  const startDate = formatGoogleDate(event.start, event.isAllDay);
  const endDate = formatGoogleDate(event.end, event.isAllDay);
  
  // Prepare query parameters for Google Calendar URL
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${startDate}/${endDate}`
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Create and download an ICS file for Apple/Outlook Calendar
 */
export function createICSFile(event: CalendarEvent): void {
  // Format dates for ICS file
  // ICS uses YYYYMMDDTHHMMSSZ format
  const formatICSDate = (date: Date, isAllDay: boolean) => {
    if (isAllDay) {
      const formatted = date.toISOString().replace(/[-:]/g, '').split('T')[0];
      return formatted + 'T000000';
    }
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  };
  
  const startDate = formatICSDate(event.start, event.isAllDay);
  const endDate = formatICSDate(event.end, event.isAllDay);
  
  // Create ICS content
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wakti//NONSGML Calendar//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `UID:${generateUid()}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  
  // Create and download the file
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const fileName = `${event.title.replace(/\s+/g, '_')}_event.ics`;
  
  // Create a download link and trigger it
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate a unique ID for the ICS file
 */
function generateUid(): string {
  return `wakti-event-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}
