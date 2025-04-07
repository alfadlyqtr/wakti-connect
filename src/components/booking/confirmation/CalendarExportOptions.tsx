
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Mail, Download } from "lucide-react";
import { BookingWithRelations } from "@/types/booking.types";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

interface CalendarExportOptionsProps {
  booking: BookingWithRelations;
  serviceName: string;
}

const CalendarExportOptions: React.FC<CalendarExportOptionsProps> = ({ 
  booking, 
  serviceName 
}) => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  
  const generateGoogleCalendarUrl = () => {
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);
    const eventDetails = {
      text: `${t("booking.serviceDetails")}: ${serviceName}`,
      details: booking.description || `${t("booking.serviceDetails")} ${serviceName}`,
      location: booking.location || "Event Location",
      dates: `${format(startTime, "yyyyMMdd'T'HHmmss")}/${format(endTime, "yyyyMMdd'T'HHmmss")}`
    };

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.text)}&details=${encodeURIComponent(eventDetails.details)}&location=${encodeURIComponent(eventDetails.location)}&dates=${eventDetails.dates}`;
  };

  const generateAppleCalendarUrl = () => {
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);
    
    // Apple Calendar uses .ics files, so we create a downloadable data URI
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${format(startTime, "yyyyMMdd'T'HHmmss")}`,
      `DTEND:${format(endTime, "yyyyMMdd'T'HHmmss")}`,
      `SUMMARY:${t("booking.serviceDetails")}: ${serviceName}`,
      `DESCRIPTION:${booking.description || `${t("booking.serviceDetails")} ${serviceName}`}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");
    
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
  };
  
  const generateOutlookCalendarUrl = () => {
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);
    
    // Outlook also uses .ics files with same format as Apple Calendar
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `DTSTART:${format(startTime, "yyyyMMdd'T'HHmmss")}`,
      `DTEND:${format(endTime, "yyyyMMdd'T'HHmmss")}`,
      `SUMMARY:${t("booking.serviceDetails")}: ${serviceName}`,
      `DESCRIPTION:${booking.description || `${t("booking.serviceDetails")} ${serviceName}`}`,
      "X-MICROSOFT-CDO-BUSYSTATUS:BUSY",
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
  
  const downloadOutlookCalendar = () => {
    const link = document.createElement('a');
    link.href = generateOutlookCalendarUrl();
    link.download = `Booking_${format(new Date(booking.start_time), "yyyy-MM-dd")}_outlook.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const emailCalendarInvite = () => {
    const subject = encodeURIComponent(`${t("booking.confirmed")}: ${serviceName}`);
    const startDate = format(new Date(booking.start_time), "MMMM d, yyyy 'at' h:mm a");
    const endDate = format(new Date(booking.end_time), "h:mm a");
    const body = encodeURIComponent(
      `${t("booking.confirmationMessage")} ${startDate} to ${endDate}.\n\n` +
      `${t("booking.reference")}: ${booking.id}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <Card className="shadow-sm border-primary/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          {t("events.showCalendar")}
        </CardTitle>
        <CardDescription>
          {t("booking.saveReference")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {isAuthenticated && (
            <Button 
              variant="outline" 
              className="justify-start"
              disabled
            >
              <CalendarDays className="mr-2 h-4 w-4" /> 
              WAKTI
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="justify-start" 
            onClick={openGoogleCalendar}
          >
            <CalendarDays className="mr-2 h-4 w-4" /> 
            Google
          </Button>
          
          <Button 
            variant="outline" 
            className="justify-start" 
            onClick={downloadAppleCalendar}
          >
            <Download className="mr-2 h-4 w-4" /> 
            Apple
          </Button>
          
          <Button 
            variant="outline" 
            className="justify-start" 
            onClick={downloadOutlookCalendar}
          >
            <Download className="mr-2 h-4 w-4" /> 
            Outlook
          </Button>
          
          <Button 
            variant="outline" 
            className="justify-start col-span-2 md:col-span-1"
            onClick={emailCalendarInvite}
          >
            <Mail className="mr-2 h-4 w-4" /> 
            Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarExportOptions;
