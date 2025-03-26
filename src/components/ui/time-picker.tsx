
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
  minTime,
  maxTime,
  interval = 15
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeOptions, setTimeOptions] = useState<string[]>([]);
  
  // Generate time options in intervals (default 15-minute)
  useEffect(() => {
    const options: string[] = [];
    const startMinutes = minTime 
      ? getMinutesFromTimeString(minTime) 
      : 0;
    const endMinutes = maxTime 
      ? getMinutesFromTimeString(maxTime) 
      : 24 * 60 - interval;
    
    // Generate more time options by using smaller intervals or full range
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
  
  const handleManualTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    const newValue = e.target.value;
    
    if (timeRegex.test(newValue) || newValue === '') {
      onChange(newValue);
    }
  };
  
  const handleSelectTime = (time: string) => {
    onChange(time);
    setIsOpen(false);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            value={value}
            onChange={handleManualTimeChange}
            placeholder="HH:MM"
            className="pr-10"
          />
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="absolute right-0 top-0 h-full"
            onClick={() => setIsOpen(true)}
          >
            <Clock className="h-4 w-4" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <ScrollArea className="h-60">
          <div className="py-1">
            {timeOptions.map((time) => (
              <Button
                key={time}
                variant="ghost"
                className={`w-full justify-start px-3 ${
                  time === value ? 'bg-muted' : ''
                }`}
                onClick={() => handleSelectTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
