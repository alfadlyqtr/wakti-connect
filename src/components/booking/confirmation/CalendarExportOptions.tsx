
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { BookingWithRelations } from "@/types/booking.types";
import { format } from "date-fns";

interface CalendarExportOptionsProps {
  booking: BookingWithRelations;
  serviceName: string;
}

const CalendarExportOptions: React.FC<CalendarExportOptionsProps> = ({ 
  booking, 
  serviceName 
}) => {
  const generateGoogleCalendarUrl = () => {
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);
    const eventDetails = {
      text: `Booking: ${serviceName}`,
      details: booking.description || `Your booking for ${serviceName}`,
      location: "Event Location",
      dates: `${format(startTime, "yyyyMMdd'T'HHmmss")}/${format(endTime, "yyyyMMdd'T'HHmmss")}`
    };

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.text)}&details=${encodeURIComponent(eventDetails.details)}&location=${encodeURIComponent(eventDetails.location)}&dates=${eventDetails.dates}`;
  };

  const generateAppleCalendarUrl = () => {
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);
    const formattedDate = format(startTime, "yyyy-MM-dd");
    const formattedStartTime = format(startTime, "HH:mm");
    const formattedEndTime = format(endTime, "HH:mm");
    
    // Apple Calendar uses .ics files, so we create a downloadable data URI
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${format(startTime, "yyyyMMdd'T'HHmmss")}`,
      `DTEND:${format(endTime, "yyyyMMdd'T'HHmmss")}`,
      `SUMMARY:Booking: ${serviceName}`,
      `DESCRIPTION:${booking.description || `Your booking for ${serviceName}`}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");
    
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
  };

  const openGoogleCalendar = () => {
    window.open(generateGoogleCalendarUrl(), '_blank');
  };
  
  const downloadAppleCalendar = () => {
    const link = document.createElement('a');
    link.href = generateAppleCalendarUrl();
    link.download = `Booking_${format(new Date(booking.start_time), "yyyy-MM-dd")}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Add to Calendar</CardTitle>
        <CardDescription>
          Save this appointment to your calendar to get reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button 
          variant="outline" 
          className="justify-center" 
          onClick={openGoogleCalendar}
        >
          <CalendarDays className="mr-2 h-4 w-4" /> 
          Google Calendar
        </Button>
        <Button 
          variant="outline" 
          className="justify-center" 
          onClick={downloadAppleCalendar}
        >
          <CalendarDays className="mr-2 h-4 w-4" /> 
          Apple Calendar
        </Button>
      </CardContent>
    </Card>
  );
};

export default CalendarExportOptions;
