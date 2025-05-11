
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TimePicker } from "@/components/ui/time-picker";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStaffPermissions } from "@/hooks/useStaffPermissions";

interface BusinessHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

const defaultBusinessHours: BusinessHour[] = [
  { day: "Monday", open: "09:00", close: "17:00", closed: false },
  { day: "Tuesday", open: "09:00", close: "17:00", closed: false },
  { day: "Wednesday", open: "09:00", close: "17:00", closed: false },
  { day: "Thursday", open: "09:00", close: "17:00", closed: false },
  { day: "Friday", open: "09:00", close: "17:00", closed: false },
  { day: "Saturday", open: "10:00", close: "14:00", closed: true },
  { day: "Sunday", open: "10:00", close: "14:00", closed: true },
];

interface BusinessHoursManagementProps {
  profileId: string;
  readOnly?: boolean;
}

const BusinessHoursManagement: React.FC<BusinessHoursManagementProps> = ({ 
  profileId,
  readOnly = false 
}) => {
  const queryClient = useQueryClient();
  const { isStaff } = useStaffPermissions();
  const isReadOnly = readOnly || isStaff;
  
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>(defaultBusinessHours);
  const [autoDetectHours, setAutoDetectHours] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mutation for updating business hours
  const updateBusinessHours = useMutation({
    mutationFn: async (hours: BusinessHour[]) => {
      const { data, error } = await supabase
        .from('business_hours')
        .upsert({
          business_id: profileId,
          hours: hours,
          is_automatic: autoDetectHours
        })
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessHours', profileId] });
      toast({
        title: "Business hours updated",
        description: "Your business hours have been saved successfully."
      });
    },
    onError: (error) => {
      console.error("Failed to update business hours:", error);
      toast({
        title: "Update failed",
        description: "There was an error saving your business hours.",
        variant: "destructive"
      });
    }
  });
  
  // Fetch existing business hours
  useEffect(() => {
    const fetchBusinessHours = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('business_hours')
          .select('*')
          .eq('business_id', profileId)
          .single();
          
        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
          throw error;
        }
        
        if (data && data.hours) {
          setBusinessHours(data.hours as BusinessHour[]);
          setAutoDetectHours(data.is_automatic || false);
        }
      } catch (error) {
        console.error("Error fetching business hours:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusinessHours();
  }, [profileId]);
  
  const handleTimeChange = (index: number, field: 'open' | 'close', value: string) => {
    const newHours = [...businessHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setBusinessHours(newHours);
  };
  
  const handleClosedToggle = (index: number) => {
    const newHours = [...businessHours];
    newHours[index] = { ...newHours[index], closed: !newHours[index].closed };
    setBusinessHours(newHours);
  };
  
  const saveBusinessHours = () => {
    updateBusinessHours.mutate(businessHours);
  };
  
  return (
    <Card className="border-gray-200 shadow-sm overflow-hidden">
      <CardHeader className="px-4 sm:px-6 pb-4 bg-gradient-to-r from-wakti-blue/5 to-wakti-blue/10">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-wakti-blue" />
          <div>
            <CardTitle>Business Hours</CardTitle>
            <CardDescription>
              {isReadOnly 
                ? "View business hours" 
                : "Set your regular business hours for customers"
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pt-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
          </div>
        ) : isReadOnly ? (
          <div className="space-y-4">
            {businessHours.map((hour) => (
              <div key={hour.day} className="flex justify-between py-2 border-b last:border-0">
                <div className="font-medium">{hour.day}</div>
                <div>
                  {hour.closed ? (
                    <span className="text-muted-foreground">Closed</span>
                  ) : (
                    <span>{hour.open} - {hour.close}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {businessHours.map((hour, index) => (
                <div key={hour.day} className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="w-24 font-medium">{hour.day}</div>
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-[1fr_1fr_auto] gap-2">
                    <div>
                      <Label htmlFor={`open-${index}`} className="sr-only">Opening time</Label>
                      <TimePicker
                        value={hour.open}
                        onChange={(time) => handleTimeChange(index, 'open', time)}
                        interval={15}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`close-${index}`} className="sr-only">Closing time</Label>
                      <TimePicker
                        value={hour.close}
                        onChange={(time) => handleTimeChange(index, 'close', time)}
                        interval={15}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Switch
                        id={`closed-${index}`}
                        checked={hour.closed}
                        onCheckedChange={() => handleClosedToggle(index)}
                      />
                      <Label htmlFor={`closed-${index}`}>Closed</Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <Button
                onClick={saveBusinessHours}
                disabled={updateBusinessHours.isPending}
                className="w-full"
              >
                {updateBusinessHours.isPending ? "Saving..." : "Save Business Hours"}
              </Button>
            </div>
            
            {updateBusinessHours.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  There was an error saving your business hours. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessHoursManagement;
