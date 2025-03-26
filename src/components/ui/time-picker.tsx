
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  minTime?: string;
  maxTime?: string;
  interval?: number; // in minutes
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  minTime = "00:00",
  maxTime = "23:59",
  interval = 15
}) => {
  const [timeOptions, setTimeOptions] = useState<string[]>([]);
  
  // Generate time options in intervals
  useEffect(() => {
    const options: string[] = [];
    const startMinutes = getMinutesFromTimeString(minTime);
    const endMinutes = getMinutesFromTimeString(maxTime);
    
    for (let i = startMinutes; i <= endMinutes; i += interval) {
      const hours = Math.floor(i / 60);
      const minutes = i % 60;
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      options.push(`${formattedHours}:${formattedMinutes}`);
    }
    
    setTimeOptions(options);
  }, [minTime, maxTime, interval]);
  
  const getMinutesFromTimeString = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Format display time (24h to 12h with AM/PM)
  const formatDisplayTime = (time: string): string => {
    if (!time) return "Select time";
    
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const hour12 = hour % 12 || 12;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    
    return `${hour12}:${minuteStr} ${ampm}`;
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-left font-normal"
          type="button"
        >
          {value ? formatDisplayTime(value) : "Select time"}
          <Clock className="h-4 w-4 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-2">
          <Input
            type="time"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mb-2"
          />
        </div>
        <ScrollArea className="h-72 rounded-md border">
          <div className="p-1">
            {timeOptions.map((time) => (
              <Button
                key={time}
                variant="ghost"
                className={`w-full justify-start px-2 py-1.5 text-left rounded-sm ${
                  time === value ? 'bg-primary text-primary-foreground' : ''
                }`}
                onClick={() => onChange(time)}
              >
                {formatDisplayTime(time)}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
