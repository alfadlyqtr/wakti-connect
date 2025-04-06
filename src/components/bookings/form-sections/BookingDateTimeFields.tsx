
import React from "react";
import { Control, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Service } from "@/types/service.types";
import { useTranslation } from "react-i18next";

interface BookingDateTimeFieldsProps {
  control: Control<any>;
  selectedService?: Service;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

const BookingDateTimeFields: React.FC<BookingDateTimeFieldsProps> = ({ 
  control, 
  selectedService,
  watch,
  setValue
}) => {
  const { t } = useTranslation();
  
  const calculateEndTime = (startTime: string, durationMinutes: number = 60) => {
    if (!startTime) return "";
    
    const [hours, minutes] = startTime.split(":").map(Number);
    
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
    
    return `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;
  };
  
  // Watch for changes to start time and update end time based on service duration
  const startTime = watch("start_time");
  
  // Update end time when start time changes or service is selected
  React.useEffect(() => {
    if (startTime) {
      const duration = selectedService?.duration || 60;
      const calculatedEndTime = calculateEndTime(startTime, duration);
      setValue("end_time", calculatedEndTime);
    }
  }, [startTime, selectedService, setValue]);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('booking.form.dateTime')}</h3>
      
      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{t('booking.date')}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>{t('booking.form.pickDate')}</span>
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
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="start_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('booking.form.startTime')}</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
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
              <FormLabel>{t('booking.form.endTime')}</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  readOnly={!!selectedService}
                  className={selectedService ? "bg-muted cursor-not-allowed" : ""}
                />
              </FormControl>
              {selectedService && (
                <p className="text-xs text-muted-foreground">
                  {t('booking.autoDuration', { duration: selectedService.duration })}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BookingDateTimeFields;
