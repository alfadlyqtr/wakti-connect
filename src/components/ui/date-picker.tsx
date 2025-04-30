
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";

interface DatePickerProps {
  date?: Date;
  setDate?: (date: Date | undefined) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function DatePicker({ date, setDate, className, disabled = false, placeholder = "Pick a date" }: DatePickerProps) {
  const isMobile = useIsMobile();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            isMobile && "h-8 px-2 py-1 text-xs",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
          {date ? format(date, isMobile ? "MMM d, yyyy" : "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-auto p-0", isMobile && "max-w-[280px]")} align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
