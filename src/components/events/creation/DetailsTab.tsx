
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import LocationInput from "../location/LocationInput";
import { CardContent, CardFooter } from "@/components/ui/card";

interface DetailsTabProps {
  register: any;
  errors: any;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  isAllDay: boolean;
  setIsAllDay: (isAllDay: boolean) => void;
  location: string;
  locationType: 'manual' | 'google_maps';
  mapsUrl: string;
  handleLocationChange: (value: string, type: 'manual' | 'google_maps', url?: string) => void;
  handleNextTab: () => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({
  register,
  errors,
  selectedDate,
  setSelectedDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  isAllDay,
  setIsAllDay,
  location,
  locationType,
  mapsUrl,
  handleLocationChange,
  handleNextTab
}) => {
  return (
    <>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            {...register("title", { required: "Title is required" })}
            placeholder="Event title"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Add a description for your event"
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <LocationInput
            locationType={locationType}
            location={location}
            mapsUrl={mapsUrl}
            onLocationChange={handleLocationChange}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="isAllDay">All Day Event</Label>
            <Switch
              id="isAllDay"
              checked={isAllDay}
              onCheckedChange={setIsAllDay}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {!isAllDay && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <div className="flex">
                  <Clock className="mr-2 h-4 w-4 mt-3" />
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <div className="flex">
                  <Clock className="mr-2 h-4 w-4 mt-3" />
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button type="button" onClick={handleNextTab}>
          Next: Customize
        </Button>
      </CardFooter>
    </>
  );
};

export default DetailsTab;
