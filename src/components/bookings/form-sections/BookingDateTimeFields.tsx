
import React, { useEffect } from "react";
import { Control, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimePicker } from "@/components/ui/time-picker";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Service } from "@/types/service.types";

interface BookingDateTimeFieldsProps {
  control: Control<any>;
  selectedService: Service | undefined;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

const BookingDateTimeFields: React.FC<BookingDateTimeFieldsProps> = ({ 
  control, 
  selectedService,
  watch,
  setValue
}) => {
  // Update end time when service or start time changes
  useEffect(() => {
    const startTime = watch('start_time');
    if (selectedService && startTime) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(startDate.getTime() + selectedService.duration * 60000);
      const endTimeStr = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
      
      setValue('end_time', endTimeStr);
    }
  }, [watch('start_time'), selectedService, setValue, watch]);

  return (
    <div className="space-y-4">
      <h3 className="text-md font-semibold">Date & Time</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full pl-3 text-left font-normal"
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="start_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <TimePicker
                  value={field.value}
                  onChange={field.onChange}
                  interval={15}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="end_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <TimePicker
                  value={field.value}
                  onChange={field.onChange}
                  interval={15}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BookingDateTimeFields;
