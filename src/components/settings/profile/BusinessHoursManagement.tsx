import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { WorkingHour } from "@/types/business-settings.types";
import { useStaffPermissions } from "@/hooks/useStaffPermissions";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const defaultWorkingHours: WorkingHour[] = [
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

const BusinessHoursManagement: React.FC<BusinessHoursManagementProps> = ({ profileId, readOnly = false }) => {
  const [hours, setHours] = useState<WorkingHour[]>(defaultWorkingHours);
  const [isAutomatic, setIsAutomatic] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isStaff } = useStaffPermissions();
  const queryClient = useQueryClient();
  
  // If component is in read-only mode, use provided profileId
  // Otherwise use the authenticated user's ID
  const effectiveReadOnly = readOnly || isStaff;

  // Fetch business hours data
  const { data: businessHoursData, isLoading: isLoadingHours } = useQuery({
    queryKey: ['businessHours', profileId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('business_hours')
          .select('*')
          .eq('business_id', profileId)
          .single();
          
        if (error) {
          console.error("Error fetching business hours:", error);
          return null;
        }
        
        return data;
      } catch (error) {
        console.error("Error in business hours query:", error);
        return null;
      }
    },
    enabled: !!profileId,
  });

  // Update hours state when data is loaded
  useEffect(() => {
    if (businessHoursData) {
      setHours(businessHoursData.hours || defaultWorkingHours);
      setIsAutomatic(businessHoursData.is_automatic || false);
    } else {
      setHours(defaultWorkingHours);
      setIsAutomatic(false);
    }
    setIsLoading(false);
  }, [businessHoursData]);

  // Save or update business hours
  const saveHoursMutation = useMutation({
    mutationFn: async () => {
      const { data: existingData } = await supabase
        .from('business_hours')
        .select('id')
        .eq('business_id', profileId)
        .maybeSingle();
      
      if (existingData) {
        // Update existing record
        const { data, error } = await supabase
          .from('business_hours')
          .update({
            hours: hours,
            is_automatic: isAutomatic,
            updated_at: new Date().toISOString()
          })
          .eq('business_id', profileId)
          .select();
          
        if (error) throw error;
        return data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('business_hours')
          .insert({
            business_id: profileId,
            hours: hours,
            is_automatic: isAutomatic
          })
          .select();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      toast({
        title: "Business hours updated",
        description: "Your business hours have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['businessHours', profileId] });
    },
    onError: (error) => {
      console.error("Error saving business hours:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "There was a problem saving your business hours.",
      });
    }
  });

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
    saveHoursMutation.mutate();
  };

  if (isLoadingHours) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
          <CardDescription>Loading your business hours...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Business Hours</CardTitle>
            <CardDescription>Set your regular business hours</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="auto-hours">Automatic Hours</Label>
            <Switch 
              id="auto-hours"
              checked={isAutomatic}
              onCheckedChange={setIsAutomatic}
              disabled={effectiveReadOnly}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {effectiveReadOnly && (
          <Alert variant="warning" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You are viewing business hours in read-only mode.
            </AlertDescription>
          </Alert>
        )}
      
        <div className="space-y-4">
          {hours.map((hour, index) => (
            <div key={hour.day} className="grid grid-cols-[1fr_1fr_1fr_80px] gap-2 items-center">
              <div>{hour.day}</div>
              <Input
                type="time"
                value={hour.open}
                onChange={(e) => handleTimeChange(index, "open", e.target.value)}
                disabled={hour.closed || effectiveReadOnly || isAutomatic}
              />
              <Input
                type="time"
                value={hour.close}
                onChange={(e) => handleTimeChange(index, "close", e.target.value)}
                disabled={hour.closed || effectiveReadOnly || isAutomatic}
              />
              <div className="flex items-center space-x-2">
                <Switch
                  checked={hour.closed}
                  onCheckedChange={() => handleClosedToggle(index)}
                  id={`closed-${index}`}
                  disabled={effectiveReadOnly || isAutomatic}
                />
                <Label htmlFor={`closed-${index}`}>Closed</Label>
              </div>
            </div>
          ))}
          
          {!effectiveReadOnly && (
            <Button 
              className="w-full mt-4" 
              onClick={handleSave}
              disabled={saveHoursMutation.isPending || isAutomatic}
            >
              {saveHoursMutation.isPending ? "Saving..." : "Save Working Hours"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessHoursManagement;
