
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Clock, Info, Loader2 } from "lucide-react";
import { useUpdatePageMutation } from "@/hooks/business-page/useBusinessPageMutations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tables } from "@/integrations/supabase/types";
import { Separator } from "@/components/ui/separator";
import { useBusinessPageQueries } from "@/hooks/business-page/useBusinessPageQueries";
import { supabase } from "@/integrations/supabase/client";

interface BusinessHoursManagementProps {
  profileId: string;
  readOnly?: boolean;
}

type BusinessHour = {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

const defaultBusinessHours: BusinessHour[] = [
  { day: "Monday", openTime: "09:00", closeTime: "17:00", isClosed: false },
  { day: "Tuesday", openTime: "09:00", closeTime: "17:00", isClosed: false },
  { day: "Wednesday", openTime: "09:00", closeTime: "17:00", isClosed: false },
  { day: "Thursday", openTime: "09:00", closeTime: "17:00", isClosed: false },
  { day: "Friday", openTime: "09:00", closeTime: "17:00", isClosed: false },
  { day: "Saturday", openTime: "10:00", closeTime: "14:00", isClosed: true },
  { day: "Sunday", openTime: "10:00", closeTime: "14:00", isClosed: true },
];

const BusinessHoursManagement: React.FC<BusinessHoursManagementProps> = ({ profileId, readOnly = false }) => {
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>(defaultBusinessHours);
  const [isAutomatic, setIsAutomatic] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { updatePage } = useUpdatePageMutation();
  const { data: ownerBusinessPage } = useBusinessPageQueries().useOwnerBusinessPageQuery();

  // Fetch existing business hours from database
  useEffect(() => {
    const fetchBusinessHours = async () => {
      try {
        if (!profileId) return;
        
        // If we have an existing business page, try to get hours from there
        if (ownerBusinessPage?.id) {
          const { data: sectionData } = await supabase
            .from('business_page_sections')
            .select('*')
            .eq('page_id', ownerBusinessPage.id)
            .eq('section_type', 'hours')
            .single();
          
          if (sectionData && sectionData.section_content) {
            // Parse hours from section_content
            const content = sectionData.section_content;
            if (content.hours && Array.isArray(content.hours)) {
              const loadedHours = content.hours.map((hour: any) => ({
                day: hour.day,
                openTime: hour.open_time || hour.openTime || "09:00",
                closeTime: hour.close_time || hour.closeTime || "17:00",
                isClosed: hour.is_closed || hour.isClosed || false
              }));
              
              setBusinessHours(loadedHours);
              setIsAutomatic(content.isAutomatic !== false);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching business hours:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessHours();
  }, [profileId, ownerBusinessPage?.id]);

  const handleSaveHours = async () => {
    try {
      setIsSaving(true);
      
      if (!ownerBusinessPage) {
        toast({
          title: "Error",
          description: "Could not find business page to update",
          variant: "destructive"
        });
        return;
      }
      
      // Format hours for storage
      const formattedHours = businessHours.map(hour => ({
        day: hour.day,
        open_time: hour.openTime,
        close_time: hour.closeTime,
        is_closed: hour.isClosed
      }));

      // Check if hours section exists
      const { data: existingSection } = await supabase
        .from('business_page_sections')
        .select('id')
        .eq('page_id', ownerBusinessPage.id)
        .eq('section_type', 'hours')
        .single();

      if (existingSection) {
        // Update existing section
        await supabase
          .from('business_page_sections')
          .update({
            section_content: {
              hours: formattedHours,
              isAutomatic: isAutomatic
            }
          })
          .eq('id', existingSection.id);
      } else {
        // Create new section
        await supabase
          .from('business_page_sections')
          .insert({
            page_id: ownerBusinessPage.id,
            section_type: 'hours',
            section_order: 4, // Default order
            is_visible: true,
            section_content: {
              hours: formattedHours,
              isAutomatic: isAutomatic
            }
          });
      }
      
      toast({
        title: "Hours updated",
        description: "Your business hours have been saved successfully."
      });
    } catch (error) {
      console.error("Error saving business hours:", error);
      toast({
        title: "Error",
        description: "Failed to save business hours. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateHour = (index: number, field: string, value: string | boolean) => {
    const updatedHours = [...businessHours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setBusinessHours(updatedHours);
  };

  if (isLoading) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <CardTitle>Business Hours</CardTitle>
          </div>
          <CardDescription>Loading business hours...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <CardTitle>Business Hours</CardTitle>
        </div>
        <CardDescription>Set your regular business hours</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 pb-2">
          <Switch 
            id="automatic-hours" 
            checked={isAutomatic}
            onCheckedChange={setIsAutomatic}
            disabled={readOnly}
          />
          <Label htmlFor="automatic-hours">
            Automatically display hours on your public profile
          </Label>
        </div>
        
        {!isAutomatic && (
          <div className="rounded-md bg-muted/50 p-3">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                When automatic display is turned off, your business hours won't be visible on your public profile.
                You can still set them here for your reference.
              </p>
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-4 pt-2">
          {businessHours.map((hour, index) => (
            <div key={hour.day} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
              <div className="font-medium">{hour.day}</div>
              <Select
                value={hour.openTime}
                onValueChange={(value) => updateHour(index, 'openTime', value)}
                disabled={hour.isClosed || readOnly}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Open" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <SelectItem key={`${hour}:00`} value={`${hour.toString().padStart(2, '0')}:00`}>
                      {`${hour.toString().padStart(2, '0')}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={hour.closeTime}
                onValueChange={(value) => updateHour(index, 'closeTime', value)}
                disabled={hour.isClosed || readOnly}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Close" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <SelectItem key={`${hour}:00`} value={`${hour.toString().padStart(2, '0')}:00`}>
                      {`${hour.toString().padStart(2, '0')}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Switch
                  id={`closed-${index}`}
                  checked={hour.isClosed}
                  onCheckedChange={(checked) => updateHour(index, 'isClosed', checked)}
                  disabled={readOnly}
                />
                <Label htmlFor={`closed-${index}`}>Closed</Label>
              </div>
            </div>
          ))}

          {!readOnly && (
            <Button 
              onClick={handleSaveHours} 
              disabled={isSaving || readOnly}
              className="mt-4"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Hours"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessHoursManagement;
