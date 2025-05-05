
import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EventType } from "@/types/calendar.types";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalendarEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
  onEntryCreated?: () => void;
}

export default function CalendarEntryDialog({
  open,
  onOpenChange,
  defaultDate = new Date(),
  onEntryCreated
}: CalendarEntryDialogProps) {
  const isMobile = useIsMobile();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(defaultDate);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate(defaultDate);
    setStartTime("");
    setEndTime("");
    setLocation("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const validate = () => {
    if (!title.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a title for your entry",
        variant: "destructive",
      });
      return false;
    }

    if (!date) {
      toast({
        title: "Missing information",
        description: "Please select a date",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const formatTimeToISO = (timeString: string, dateObj: Date) => {
    if (!timeString) return null;

    const [hours, minutes] = timeString.split(":");
    const newDate = new Date(dateObj);
    newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return newDate.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to create calendar entries",
          variant: "destructive",
        });
        return;
      }
      
      const userId = session.user.id;
      
      // Format start and end times
      const formattedStartTime = startTime ? formatTimeToISO(startTime, date!) : date!.toISOString();
      const formattedEndTime = endTime ? formatTimeToISO(endTime, date!) : date!.toISOString();

      // Insert the event into the events table
      const { data, error } = await supabase.from('events').insert({
        title: title,
        description: description,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        location: location,
        user_id: userId,
        status: "draft" as "draft" | "sent" | "accepted" | "declined" | "recalled", // Fix for the TypeScript error
        is_all_day: !startTime && !endTime
      });

      if (error) {
        console.error("Error creating event:", error);
        toast({
          title: "Error",
          description: "Failed to create calendar entry.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Calendar entry created successfully!",
      });

      // Close the dialog and reset form
      handleClose();
      
      // Notify parent component
      if (onEntryCreated) {
        onEntryCreated();
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={isMobile ? "w-[90vw] p-4" : "max-w-md"}>
        <DialogHeader>
          <DialogTitle>Add Calendar Entry</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting, Appointment, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <DatePicker date={date} setDate={setDate} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time (optional)</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time (optional)</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Office, Home, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this entry..."
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
