import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TimeField } from "@/components/ui/time-field";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { useBusinessPageQueries } from "@/hooks/business-page/useBusinessPageQueries";

// Define working hours type
type WorkingHour = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};

// Default working hours
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

const BusinessHoursManagement: React.FC<BusinessHoursManagementProps> = ({ 
  profileId, 
  readOnly = false 
}) => {
  const queryClient = useQueryClient();
  const [hours, setHours] = useState<WorkingHour[]>(defaultWorkingHours);
  const [isAutomatic, setIsAutomatic] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Use our custom hook to fetch business page and sections
  const { useOwnerBusinessPageQuery } = useBusinessPageQueries();
  const { data: businessPage } = useOwnerBusinessPageQuery();
  
  // Mutation to update business hours directly in the business_page_sections table
  const updateBusinessHours = useMutation({
    mutationFn: async ({ 
      pageId, 
      hours, 
      isAutomatic 
    }: { 
      pageId: string; 
      hours: WorkingHour[]; 
      isAutomatic: boolean;
    }) => {
      // First check if a hours section already exists
      const { data: existingSections, error: fetchError } = await supabase
        .from('business_page_sections')
        .select('*')
        .eq('page_id', pageId)
        .eq('section_type', 'hours')
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      // If section exists, update it
      if (existingSections) {
        const { error } = await supabase
          .from('business_page_sections')
          .update({
            section_content: {
              hours,
              isAutomatic
            }
          })
          .eq('id', existingSections.id);
          
        if (error) throw error;
        return existingSections.id;
      } 
      
      // Otherwise create a new section
      const { data, error } = await supabase
        .from('business_page_sections')
        .insert({
          page_id: pageId,
          section_type: 'hours',
          section_order: 3, // Give it a reasonable order
          section_content: {
            hours,
            isAutomatic
          },
          is_visible: true
        })
        .select()
        .single();
        
      if (error) throw error;
      return data.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessPageSections'] });
      queryClient.invalidateQueries({ queryKey: ['ownerBusinessPage'] });
      toast({
        title: "Business hours updated",
        description: "Your business hours have been saved successfully."
      });
    },
    onError: (error) => {
      console.error("Error saving business hours:", error);
      toast({
        title: "Error saving hours",
        description: "There was a problem saving your business hours.",
        variant: "destructive"
      });
    }
  });

  // Load existing hours if available
  useEffect(() => {
    if (businessPage) {
      // Fetch sections for this page
      const fetchSections = async () => {
        const { data: sections, error } = await supabase
          .from('business_page_sections')
          .select('*')
          .eq('page_id', businessPage.id)
          .eq('section_type', 'hours');
          
        if (error) {
          console.error("Error fetching business hours section:", error);
          return;
        }
        
        if (sections && sections.length > 0) {
          const hoursSection = sections[0];
          const content = hoursSection.section_content as any;
          
          if (content && content.hours) {
            setHours(content.hours);
          }
          
          if (content && typeof content.isAutomatic === 'boolean') {
            setIsAutomatic(content.isAutomatic);
          }
        }
      };
      
      fetchSections();
    }
  }, [businessPage]);

  const handleTimeChange = (index: number, field: "open" | "close", value: string) => {
    const updatedHours = [...hours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setHours(updatedHours);
  };

  const handleClosedToggle = (index: number) => {
    const updatedHours = [...hours];
    updatedHours[index] = { ...updatedHours[index], closed: !updatedHours[index].closed };
    setHours(updatedHours);
  };

  const handleAutomaticToggle = () => {
    setIsAutomatic(!isAutomatic);
  };

  const handleSave = async () => {
    if (!businessPage?.id) {
      toast({
        title: "Error",
        description: "Business page not found. Please create a business page first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    try {
      await updateBusinessHours.mutateAsync({
        pageId: businessPage.id,
        hours,
        isAutomatic
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-gray-200 shadow-sm overflow-hidden">
      <CardHeader className="px-4 sm:px-6 pb-4 bg-gradient-to-r from-wakti-blue/5 to-wakti-blue/10">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-wakti-blue" />
          <div>
            <CardTitle>Business Hours</CardTitle>
            <CardDescription>Set your regular business operating hours</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pt-4 pb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="automatic-hours">Use automatic business hours</Label>
            <Switch 
              id="automatic-hours" 
              checked={isAutomatic} 
              onCheckedChange={handleAutomaticToggle} 
              disabled={readOnly}
            />
          </div>
          
          <Separator className="my-4" />
          
          {isAutomatic ? (
            <div className="bg-gray-50 p-4 rounded-md text-center text-muted-foreground">
              Business hours will be automatically managed based on your availability.
            </div>
          ) : (
            <div className="space-y-4">
              {hours.map((hour, index) => (
                <div key={hour.day} className="grid grid-cols-[1fr_1fr_1fr_80px] gap-2 items-center">
                  <div className="font-medium">{hour.day}</div>
                  <TimeField
                    value={hour.open}
                    onChange={(value) => handleTimeChange(index, "open", value)}
                    disabled={hour.closed || readOnly}
                    className="h-9"
                  />
                  <TimeField
                    value={hour.close}
                    onChange={(value) => handleTimeChange(index, "close", value)}
                    disabled={hour.closed || readOnly}
                    className="h-9"
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={hour.closed}
                      onCheckedChange={() => handleClosedToggle(index)}
                      disabled={readOnly}
                      id={`closed-${index}`}
                    />
                    <Label htmlFor={`closed-${index}`} className="text-xs">Closed</Label>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!readOnly && (
            <Button 
              onClick={handleSave} 
              className="w-full mt-4"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-r-transparent border-white"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Business Hours
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessHoursManagement;
