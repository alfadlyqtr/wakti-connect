
import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";

interface BusinessHour {
  id: string;
  business_id: string;
  day_of_week: number;
  is_open: boolean;
  opening_time: string | null;
  closing_time: string | null;
}

interface BusinessHoursProps {
  businessHours: BusinessHour[];
}

const dayNames = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const BusinessHours: React.FC<BusinessHoursProps> = ({ businessHours }) => {
  // Function to format a time string (e.g., "09:00:00") to a more readable format (e.g., "9:00 AM")
  const formatTimeString = (timeString: string | null) => {
    if (!timeString) return "";
    
    try {
      // Parse time string in format "HH:MM:SS" to Date object
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      
      // Format the date to show only the time (e.g., "9:00 AM")
      return format(date, "h:mm a");
    } catch (error) {
      console.error("Error formatting time:", error);
      return timeString; // Return original string if formatting fails
    }
  };

  // Create a lookup object for quick access
  const hoursByDay: Record<number, BusinessHour> = {};
  businessHours.forEach(hour => {
    hoursByDay[hour.day_of_week] = hour;
  });

  return (
    <div className="space-y-2">
      {dayNames.map((day, index) => {
        // Get the business hours for the current day (0 = Monday, 1 = Tuesday, etc.)
        const dayHours = hoursByDay[index] || {
          is_open: false,
          opening_time: null,
          closing_time: null
        };

        return (
          <div key={index} className="flex items-center justify-between py-1.5">
            <div className="font-medium">{day}</div>
            <div className="flex items-center">
              {dayHours.is_open ? (
                <>
                  <span className="text-sm">
                    {formatTimeString(dayHours.opening_time)} - {formatTimeString(dayHours.closing_time)}
                  </span>
                  <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />
                </>
              ) : (
                <>
                  <span className="text-sm text-muted-foreground">Closed</span>
                  <XCircle className="ml-2 h-4 w-4 text-muted-foreground" />
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BusinessHours;
