
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

interface BusinessHours {
  [key: string]: {
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  };
}

const defaultBusinessHours: BusinessHours = {
  monday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  tuesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  wednesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  thursday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  friday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
  saturday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
  sunday: { isOpen: false, openTime: "09:00", closeTime: "17:00" },
};

const dayNames: { [key: string]: string } = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

interface BusinessHoursManagementProps {
  profileId?: string;
  readOnly?: boolean;
}

const BusinessHoursManagement: React.FC<BusinessHoursManagementProps> = ({ 
  profileId,
  readOnly = false 
}) => {
  const [businessHours, setBusinessHours] = useState<BusinessHours>(defaultBusinessHours);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Get current day for highlighting
  // Fix: Get the day name using the current date and convert it to lowercase
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const currentDay = today as keyof typeof dayNames;
  
  const handleToggleDay = (day: string) => {
    if (readOnly) return;
    
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen
      }
    }));
  };
  
  const handleTimeChange = (day: string, field: 'openTime' | 'closeTime', value: string) => {
    if (readOnly) return;
    
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };
  
  const handleSaveHours = async () => {
    if (readOnly) return;
    
    setIsLoading(true);
    try {
      // This would call an API to save the hours
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Business hours updated",
        description: "Your business hours have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was a problem updating your business hours.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Business Hours
        </CardTitle>
        <CardDescription>
          Set your regular business hours. Customers will see these hours on your business page.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {Object.entries(businessHours).map(([day, hours]) => (
            <div key={day} className={`p-3 rounded-md ${day === currentDay ? 'bg-muted' : ''}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-medium">
                    {dayNames[day]}
                  </Label>
                  {day === currentDay && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant={hours.isOpen ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggleDay(day)}
                    disabled={readOnly}
                    className="w-24"
                  >
                    {hours.isOpen ? "Open" : "Closed"}
                  </Button>
                </div>
              </div>
              
              {hours.isOpen && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <Label htmlFor={`${day}-open`} className="mb-1 text-xs">
                        Opening Time
                      </Label>
                      <input
                        id={`${day}-open`}
                        type="time"
                        value={hours.openTime}
                        onChange={(e) => handleTimeChange(day, 'openTime', e.target.value)}
                        disabled={readOnly}
                        className="w-32 px-2 py-1 border rounded"
                      />
                    </div>
                    <span className="mx-2">to</span>
                    <div className="flex flex-col">
                      <Label htmlFor={`${day}-close`} className="mb-1 text-xs">
                        Closing Time
                      </Label>
                      <input
                        id={`${day}-close`}
                        type="time"
                        value={hours.closeTime}
                        onChange={(e) => handleTimeChange(day, 'closeTime', e.target.value)}
                        disabled={readOnly}
                        className="w-32 px-2 py-1 border rounded"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {!readOnly && (
            <div className="flex justify-end mt-4">
              <Button 
                onClick={handleSaveHours} 
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" />
                {isLoading ? "Saving..." : "Save Business Hours"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessHoursManagement;
