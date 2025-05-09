
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TimePicker } from "@/components/ui/time-picker";

type DaySchedule = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday", 
  "Saturday",
  "Sunday"
];

const defaultHours = {
  weekday: { open: "09:00", close: "17:00" },
  weekend: { open: "10:00", close: "14:00" }
};

const BusinessHoursField: React.FC = () => {
  const { control, setValue, watch } = useFormContext();
  const businessHoursValue = watch("business_hours") || "";
  
  // Parse hours from string or use defaults
  const [hours, setHours] = useState<DaySchedule[]>(() => {
    if (!businessHoursValue) {
      return daysOfWeek.map(day => ({
        day,
        ...defaultHours[day === "Saturday" || day === "Sunday" ? "weekend" : "weekday"],
        closed: day === "Saturday" || day === "Sunday"
      }));
    }
    
    try {
      return JSON.parse(businessHoursValue);
    } catch (e) {
      return daysOfWeek.map(day => ({
        day,
        ...defaultHours[day === "Saturday" || day === "Sunday" ? "weekend" : "weekday"],
        closed: day === "Saturday" || day === "Sunday"
      }));
    }
  });

  const handleTimeChange = (index: number, field: "open" | "close", value: string) => {
    const updatedHours = [...hours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setHours(updatedHours);
    setValue("business_hours", JSON.stringify(updatedHours), { shouldDirty: true });
  };

  const handleClosedToggle = (index: number) => {
    const updatedHours = [...hours];
    updatedHours[index] = { ...updatedHours[index], closed: !updatedHours[index].closed };
    setHours(updatedHours);
    setValue("business_hours", JSON.stringify(updatedHours), { shouldDirty: true });
  };

  return (
    <FormField
      control={control}
      name="business_hours"
      render={({ field, fieldState }) => (
        <FormItem className="col-span-2">
          <FormLabel>Business Hours</FormLabel>
          <Card className="border border-input">
            <CardContent className="p-4 space-y-2">
              {hours.map((daySchedule, index) => (
                <React.Fragment key={daySchedule.day}>
                  <div className="grid grid-cols-[1fr_1fr_1fr_100px] gap-2 items-center">
                    <div className="font-medium">{daySchedule.day}</div>
                    
                    <div>
                      <TimePicker 
                        value={daySchedule.open} 
                        onChange={(time) => handleTimeChange(index, "open", time)}
                        interval={30}
                        minTime="00:00"
                        maxTime="23:59"
                      />
                    </div>
                    
                    <div>
                      <TimePicker 
                        value={daySchedule.close} 
                        onChange={(time) => handleTimeChange(index, "close", time)}
                        interval={30}
                        minTime="00:00"
                        maxTime="23:59"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={daySchedule.closed}
                        onCheckedChange={() => handleClosedToggle(index)}
                        id={`closed-${index}`}
                      />
                      <Label htmlFor={`closed-${index}`} className="text-sm">Closed</Label>
                    </div>
                  </div>
                  {index < hours.length - 1 && <Separator className="my-2" />}
                </React.Fragment>
              ))}
            </CardContent>
          </Card>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};

export default BusinessHoursField;
