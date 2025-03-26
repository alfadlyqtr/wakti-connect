
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "../TaskFormSchema";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimePickerFieldProps {
  form: UseFormReturn<TaskFormValues>;
  name: "dueTime" | `subtasks.${number}.dueTime`;
  label?: string;
}

export const TimePickerField: React.FC<TimePickerFieldProps> = ({ 
  form, 
  name,
  label = "Time" 
}) => {
  // Use state to track the input value for direct time input
  const [timeInput, setTimeInput] = useState<string>("");
  
  // Common times that people often select
  const quickTimeOptions = [
    { label: "Morning", value: "09:00" },
    { label: "Noon", value: "12:00" },
    { label: "Afternoon", value: "15:00" },
    { label: "Evening", value: "18:00" },
    { label: "Night", value: "21:00" }
  ];

  // Generate hours options
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  
  // Generate minutes options (15-minute intervals)
  const minutes = Array.from({ length: 4 }, (_, i) => (i * 15).toString().padStart(2, '0'));

  // Handle direct time input
  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeInput(e.target.value);
  };

  // Apply direct time input when user hits Enter
  const handleTimeInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Simple validation for HH:MM format
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
      if (timeRegex.test(timeInput)) {
        onChange(timeInput);
      } else {
        // Reset input if invalid
        setTimeInput("");
      }
    }
  };

  // Format 24h time to 12h for display
  const formatTimeDisplay = (time: string) => {
    if (!time) return "Select time";
    
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    
    return `${hour12}:${minute} ${ampm}`;
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? formatTimeDisplay(field.value.toString()) : "Select time"}
                  <Clock className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 space-y-3">
                {/* Quick time selections */}
                <div className="flex flex-wrap gap-2">
                  {quickTimeOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant="outline"
                      size="sm"
                      onClick={() => field.onChange(option.value)}
                      className={cn(
                        "text-xs",
                        field.value === option.value && "bg-primary text-primary-foreground"
                      )}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>

                {/* Hour and minute selectors */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs font-medium mb-2">Hour</p>
                    <div className="grid grid-cols-6 gap-1 max-h-[200px] overflow-y-auto">
                      {hours.map((hour) => (
                        <Button
                          key={hour}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            const currentValue = field.value?.toString() || "";
                            const currentMinute = currentValue.split(":")[1] || "00";
                            field.onChange(`${hour}:${currentMinute}`);
                          }}
                        >
                          {hour}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium mb-2">Minute</p>
                    <div className="grid grid-cols-3 gap-1">
                      {minutes.map((minute) => (
                        <Button
                          key={minute}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            const currentValue = field.value?.toString() || "";
                            const currentHour = currentValue.split(":")[0] || "00";
                            field.onChange(`${currentHour}:${minute}`);
                          }}
                        >
                          {minute}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct time input */}
                <div className="mt-3">
                  <p className="text-xs font-medium mb-1">Or enter time directly (HH:MM)</p>
                  <div className="flex">
                    <Input
                      placeholder="e.g. 13:30"
                      value={timeInput}
                      onChange={handleTimeInputChange}
                      onKeyDown={(e) => handleTimeInputKeyDown(e, field.onChange)}
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Clear button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    field.onChange("");
                    setTimeInput("");
                  }}
                  className="mt-2 w-full"
                >
                  Clear time
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
