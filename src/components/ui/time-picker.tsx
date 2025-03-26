
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

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
  const [isOpen, setIsOpen] = useState(false);
  const [timeOptions, setTimeOptions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
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
  
  // Scroll to selected time when popup opens
  useEffect(() => {
    if (isOpen && value && scrollRef.current) {
      const selectedIndex = timeOptions.findIndex(time => time === value);
      if (selectedIndex !== -1) {
        setTimeout(() => {
          const buttonHeight = 36; // Approximate height of each time button
          const scrollPosition = selectedIndex * buttonHeight;
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollPosition;
          }
        }, 100);
      }
    }
  }, [isOpen, value, timeOptions]);
  
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
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  const handleTimeOptionClick = (time: string) => {
    onChange(time);
    setIsOpen(false);
  };
  
  return (
    <TooltipProvider>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
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
        <PopoverContent className="w-[240px] p-0" align="start">
          <div className="p-3 border-b">
            <Tooltip>
              <TooltipTrigger asChild>
                <Input
                  type="time"
                  value={value}
                  onChange={handleTimeChange}
                  className="w-full"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Type or select a time</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <ScrollArea className="h-64" ref={scrollRef}>
            <div className="p-1">
              {timeOptions.map((time) => (
                <Button
                  key={time}
                  variant="ghost"
                  className={`w-full justify-start px-3 py-1.5 text-left rounded-sm ${
                    time === value ? 'bg-primary text-primary-foreground' : ''
                  }`}
                  onClick={() => handleTimeOptionClick(time)}
                >
                  {formatDisplayTime(time)}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};
