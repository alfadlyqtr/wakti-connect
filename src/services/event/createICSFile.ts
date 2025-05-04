
// Helper function to create an ICS file for Apple/Outlook Calendar
export function createICSFile(event: {
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
}) {
  // Create ICS content
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${event.title}`,
    `DTSTART:${formatDate(event.start)}`,
    `DTEND:${formatDate(event.end)}`,
    `DESCRIPTION:${event.description || ''}`,
    `LOCATION:${event.location || ''}`,
    `UID:${Math.random().toString(36).substring(2)}@wakti.app`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  // Create and download the file
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Format date to ICS format (YYYYMMDDTHHMMSSZ)
function formatDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, '');
}

// Helper function to create a Google Calendar URL
export function createGoogleCalendarUrl(event: {
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
}) {
  const startTime = event.start.toISOString().replace(/-|:|\.\d{3}/g, '');
  const endTime = event.end.toISOString().replace(/-|:|\.\d{3}/g, '');

  const url = new URL('https://www.google.com/calendar/event');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', event.title);
  url.searchParams.set('dates', `${startTime}/${endTime}`);
  if (event.description) url.searchParams.set('details', event.description);
  if (event.location) url.searchParams.set('location', event.location);

  return url.toString();
}
