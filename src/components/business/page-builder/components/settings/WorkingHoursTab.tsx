
import React from "react";
import { useBusinessPage, WorkingHour } from "../../context/BusinessPageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const defaultWorkingHours: WorkingHour[] = [
  { day: "Monday", open: "09:00", close: "17:00", closed: false },
  { day: "Tuesday", open: "09:00", close: "17:00", closed: false },
  { day: "Wednesday", open: "09:00", close: "17:00", closed: false },
  { day: "Thursday", open: "09:00", close: "17:00", closed: false },
  { day: "Friday", open: "09:00", close: "17:00", closed: false },
  { day: "Saturday", open: "10:00", close: "14:00", closed: true },
  { day: "Sunday", open: "10:00", close: "14:00", closed: true },
];

export const WorkingHoursTab = () => {
  const { pageData, updateSectionData } = useBusinessPage();
  const [hours, setHours] = React.useState<WorkingHour[]>(
    pageData.workingHours.hours.length ? pageData.workingHours.hours : defaultWorkingHours
  );

  const handleTimeChange = (index: number, field: "open" | "close", value: string) => {
    const newHours = [...hours];
    newHours[index] = { ...newHours[index], [field]: value };
    setHours(newHours);
  };

  const handleClosedToggle = (index: number) => {
    const newHours = [...hours];
    newHours[index] = { ...newHours[index], closed: !newHours[index].closed };
    setHours(newHours);
  };

  const handleSave = () => {
    updateSectionData("workingHours", { hours });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Working Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hours.map((hour, index) => (
            <div key={hour.day} className="grid grid-cols-[1fr_1fr_1fr_80px] gap-2 items-center">
              <div>{hour.day}</div>
              <Input
                type="time"
                value={hour.open}
                onChange={(e) => handleTimeChange(index, "open", e.target.value)}
                disabled={hour.closed}
              />
              <Input
                type="time"
                value={hour.close}
                onChange={(e) => handleTimeChange(index, "close", e.target.value)}
                disabled={hour.closed}
              />
              <div className="flex items-center space-x-2">
                <Switch
                  checked={hour.closed}
                  onCheckedChange={() => handleClosedToggle(index)}
                  id={`closed-${index}`}
                />
                <Label htmlFor={`closed-${index}`}>Closed</Label>
              </div>
            </div>
          ))}
          
          <Button className="w-full mt-4" onClick={handleSave}>Save Working Hours</Button>
        </div>
      </CardContent>
    </Card>
  );
};
