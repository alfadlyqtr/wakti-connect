
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  type: z.enum(["event", "task"]),
  description: z.string().optional(),
  location: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  priority: z.enum(["normal", "medium", "high", "urgent"]).optional(),
});

interface CalendarEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
  onEntryCreated?: () => void;
}

const CalendarEntryDialog: React.FC<CalendarEntryDialogProps> = ({
  open,
  onOpenChange,
  defaultDate = new Date(),
  onEntryCreated,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: defaultDate,
      type: "event",
      description: "",
      location: "",
      startTime: "",
      endTime: "",
      priority: "normal",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create calendar entries",
          variant: "destructive",
        });
        return;
      }

      const userId = session.user.id;
      
      // Format the date
      const formattedDate = format(values.date, "yyyy-MM-dd");
      
      // Handle based on entry type
      if (values.type === "task") {
        const taskData = {
          title: values.title,
          description: values.description || null,
          due_date: formattedDate,
          due_time: values.startTime || null,
          user_id: userId,
          status: "pending",
          priority: values.priority || "normal",
        };
        
        const { error } = await supabase.from("tasks").insert(taskData);
        
        if (error) throw error;
        
      } else if (values.type === "event") {
        // Calculate start and end times if provided
        let startTime = null;
        let endTime = null;
        
        if (values.startTime) {
          startTime = `${formattedDate}T${values.startTime}:00`;
        }
        
        if (values.endTime) {
          endTime = `${formattedDate}T${values.endTime}:00`;
        } else if (startTime) {
          // Default to 1 hour later if only start time is provided
          const startDate = new Date(startTime);
          startDate.setHours(startDate.getHours() + 1);
          endTime = startDate.toISOString();
        }
        
        const eventData = {
          title: values.title,
          description: values.description || null,
          start_time: startTime || `${formattedDate}T00:00:00`,
          end_time: endTime,
          location: values.location || null,
          user_id: userId,
          status: "scheduled",
        };
        
        const { error } = await supabase.from("events").insert(eventData);
        
        if (error) throw error;
      }
      
      toast({
        title: "Entry created",
        description: `Your ${values.type} has been added to the calendar`,
      });
      
      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
      
      // Notify parent component that an entry was created
      if (onEntryCreated) {
        onEntryCreated();
      }
      
    } catch (error) {
      console.error("Error creating calendar entry:", error);
      toast({
        title: "Error",
        description: "Failed to create calendar entry",
        variant: "destructive",
      });
    }
  };

  const entryType = form.watch("type");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Calendar Entry</DialogTitle>
          <DialogDescription>
            Create a new event or task in your calendar.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select entry type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose what type of entry to create
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <DatePicker 
                        date={field.value} 
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {entryType === "task" && (
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Priority</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      {entryType === "task" ? "Due Time" : "Start Time"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {entryType === "event" && (
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add a description" 
                      {...field} 
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {entryType === "event" && (
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Add a location" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Entry</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarEntryDialog;
