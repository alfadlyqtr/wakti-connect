
import React from "react";
import { EditorProps } from "./types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useSectionTemplates } from "@/hooks/useSectionTemplates";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle } from "lucide-react";

const HoursEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  // Ensure we have default data structure to avoid errors
  const hours = contentData.hours || {
    monday: { open: "09:00", close: "17:00", closed: false },
    tuesday: { open: "09:00", close: "17:00", closed: false },
    wednesday: { open: "09:00", close: "17:00", closed: false },
    thursday: { open: "09:00", close: "17:00", closed: false },
    friday: { open: "09:00", close: "17:00", closed: false },
    saturday: { open: "10:00", close: "15:00", closed: false },
    sunday: { open: "10:00", close: "15:00", closed: true }
  };
  
  const { templates } = useSectionTemplates('hours');
  
  const handleHoursChange = (
    day: string,
    field: 'open' | 'close',
    value: string
  ) => {
    const updatedHours = {
      ...hours,
      [day]: {
        ...hours[day],
        [field]: value
      }
    };
    
    const syntheticEvent = {
      target: {
        name: 'hours',
        value: updatedHours
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };
  
  const handleClosedToggle = (day: string, closed: boolean) => {
    const updatedHours = {
      ...hours,
      [day]: {
        ...hours[day],
        closed
      }
    };
    
    const syntheticEvent = {
      target: {
        name: 'hours',
        value: updatedHours
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };
  
  const applyTemplate = (templateContent: any) => {
    // Apply template hours to the current hours
    if (templateContent.hours) {
      const syntheticEvent = {
        target: {
          name: 'hours',
          value: templateContent.hours
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleInputChange(syntheticEvent);
    }
    
    // Apply template title if present
    if (templateContent.title) {
      const syntheticEvent = {
        target: {
          name: 'title',
          value: templateContent.title
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleInputChange(syntheticEvent);
    }
  };
  
  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" }
  ];
  
  const copyFromPrevious = (dayIndex: number) => {
    if (dayIndex === 0) return; // Can't copy to Monday from previous
    
    const previousDay = days[dayIndex - 1].key;
    const currentDay = days[dayIndex].key;
    
    const updatedHours = {
      ...hours,
      [currentDay]: {
        ...hours[previousDay]
      }
    };
    
    const syntheticEvent = {
      target: {
        name: 'hours',
        value: updatedHours
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Section Title</Label>
        <Input
          id="title"
          name="title"
          value={contentData.title || "Business Hours"}
          onChange={handleInputChange}
          placeholder="Business Hours"
        />
      </div>
      
      {templates && templates.length > 0 && (
        <div className="space-y-2">
          <Label>Quick Templates</Label>
          <div className="flex flex-wrap gap-2">
            {templates.map(template => (
              <Button 
                key={template.id} 
                variant="outline" 
                size="sm"
                onClick={() => applyTemplate(template.template_content)}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                {template.template_name}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <Card>
        <CardContent className="p-4 space-y-4">
          {days.map((day, index) => (
            <div key={day.key} className="border-b pb-3 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`${day.key}-closed`} className="font-medium flex items-center">
                    {day.label}
                  </Label>
                  
                  {index > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs"
                      onClick={() => copyFromPrevious(index)}
                    >
                      Copy from {days[index - 1].label}
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Label htmlFor={`${day.key}-closed`} className="text-sm">Closed</Label>
                  <Switch
                    id={`${day.key}-closed`}
                    checked={hours[day.key]?.closed || false}
                    onCheckedChange={(checked) => handleClosedToggle(day.key, checked)}
                  />
                </div>
              </div>
              
              {!hours[day.key]?.closed && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${day.key}-open`} className="text-sm">Opening Time</Label>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id={`${day.key}-open`}
                        type="time"
                        value={hours[day.key]?.open || "09:00"}
                        onChange={(e) => handleHoursChange(day.key, 'open', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`${day.key}-close`} className="text-sm">Closing Time</Label>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id={`${day.key}-close`}
                        type="time"
                        value={hours[day.key]?.close || "17:00"}
                        onChange={(e) => handleHoursChange(day.key, 'close', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="showLocation"
            checked={contentData.showLocation}
            onCheckedChange={(checked) => {
              const syntheticEvent = {
                target: {
                  name: 'showLocation',
                  value: checked
                }
              } as React.ChangeEvent<HTMLInputElement>;
              
              handleInputChange(syntheticEvent);
            }}
          />
          <Label htmlFor="showLocation">Show Location</Label>
        </div>
        
        {contentData.showLocation && (
          <div className="space-y-2 pl-6">
            <Label htmlFor="location">Business Location</Label>
            <Input
              id="location"
              name="location"
              value={contentData.location || ""}
              onChange={handleInputChange}
              placeholder="123 Business Street, City, Country"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HoursEditor;
