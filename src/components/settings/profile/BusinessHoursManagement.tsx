
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Clock } from "lucide-react";
import { TimePicker } from "@/components/ui/time-picker";
import { WorkingHour } from "@/types/business-settings.types";
import { toast } from "@/components/ui/use-toast";
import { useBusinessHours } from "@/hooks/useBusinessHours";

interface BusinessHoursManagementProps {
  profileId: string;
  readOnly?: boolean;
}

const defaultHours: WorkingHour[] = [
  { day: "Monday", open: "09:00", close: "17:00", closed: false },
  { day: "Tuesday", open: "09:00", close: "17:00", closed: false },
  { day: "Wednesday", open: "09:00", close: "17:00", closed: false },
  { day: "Thursday", open: "09:00", close: "17:00", closed: false },
  { day: "Friday", open: "09:00", close: "17:00", closed: false },
  { day: "Saturday", open: "10:00", close: "15:00", closed: false },
  { day: "Sunday", open: "10:00", close: "15:00", closed: true },
];

const BusinessHoursManagement: React.FC<BusinessHoursManagementProps> = ({ profileId, readOnly = false }) => {
  const [hours, setHours] = useState<WorkingHour[]>(defaultHours);
  const [isAutomatic, setIsAutomatic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { businessHours, isLoading, upsertBusinessHours } = useBusinessHours(profileId);

  // Fetch hours from database
  useEffect(() => {
    if (businessHours) {
      // Parse the JSONB hours data from Supabase if needed
      try {
        const parsedHours = typeof businessHours.hours === 'string' 
          ? JSON.parse(businessHours.hours) 
          : businessHours.hours;
        
        setHours(parsedHours);
        setIsAutomatic(businessHours.is_automatic);
      } catch (error) {
        console.error("Error parsing business hours:", error);
      }
    }
  }, [businessHours]);

  const handleSaveHours = async () => {
    if (readOnly) return;
    
    try {
      setIsSaving(true);
      
      await upsertBusinessHours.mutateAsync({
        hours,
        isAutomatic
      });
    } catch (error) {
      console.error("Error in saving business hours:", error);
      // Error is handled by the mutation hook
    } finally {
      setIsSaving(false);
    }
  };

  const updateHourSetting = (
    index: number,
    field: keyof WorkingHour,
    value: string | boolean
  ) => {
    if (readOnly) return;
    
    const updatedHours = [...hours];
    updatedHours[index] = {
      ...updatedHours[index],
      [field]: value
    };
    setHours(updatedHours);
  };

  if (isLoading) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
          <CardDescription>Loading business hours...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl">Business Hours</CardTitle>
          <CardDescription>Set your regular operating hours</CardDescription>
        </div>
        <Clock className="h-5 w-5 text-gray-400" />
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <h3 className="text-sm font-medium">Automatic Business Hours</h3>
            <p className="text-sm text-muted-foreground">
              Automatically enforce these hours for bookings
            </p>
          </div>
          <Switch 
            checked={isAutomatic} 
            onCheckedChange={!readOnly ? setIsAutomatic : undefined}
            disabled={readOnly}
          />
        </div>

        <div className="space-y-4">
          {hours.map((hour, index) => (
            <div
              key={hour.day}
              className="grid grid-cols-[1fr,auto,auto,auto] items-center gap-4"
            >
              <div>
                <p className="text-sm font-medium">{hour.day}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={!hour.closed}
                  onCheckedChange={(value) => updateHourSetting(index, "closed", !value)}
                  disabled={readOnly}
                />
                <span className="text-xs text-muted-foreground">
                  {hour.closed ? "Closed" : "Open"}
                </span>
              </div>
              <TimePicker
                value={hour.open}
                onChange={(time) => updateHourSetting(index, "open", time)}
                interval={30}
                disabled={hour.closed || readOnly}
              />
              <TimePicker
                value={hour.close}
                onChange={(time) => updateHourSetting(index, "close", time)}
                interval={30}
                disabled={hour.closed || readOnly}
              />
            </div>
          ))}
        </div>

        {!readOnly && (
          <div className="flex justify-end pt-2">
            <Button onClick={handleSaveHours} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Hours"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessHoursManagement;
