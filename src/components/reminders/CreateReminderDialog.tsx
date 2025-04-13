
import React from "react";
import { useForm } from "react-hook-form";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { createReminder } from "@/services/reminder/reminderService";
import { toast } from "@/components/ui/use-toast";
import { ReminderFormData, RepeatType } from "@/types/reminder.types";

interface CreateReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReminderCreated: () => void;
}

export const CreateReminderDialog: React.FC<CreateReminderDialogProps> = ({
  open,
  onOpenChange,
  onReminderCreated
}) => {
  const form = useForm<ReminderFormData>({
    defaultValues: {
      message: '',
      reminder_time: new Date(),
      repeat_type: 'none' as RepeatType
    }
  });
  
  const handleSubmit = async (data: ReminderFormData) => {
    try {
      // Ensure the reminder time is at least 1 minute in the future
      const minTime = new Date();
      minTime.setMinutes(minTime.getMinutes() + 1);
      
      if (data.reminder_time < minTime) {
        toast({
          title: "Invalid time",
          description: "Please set a reminder time at least 1 minute in the future.",
          variant: "destructive"
        });
        return;
      }
      
      await createReminder(data);
      
      toast({
        title: "Reminder created",
        description: "Your reminder has been created successfully.",
        variant: "success"
      });
      
      form.reset();
      onOpenChange(false);
      onReminderCreated();
    } catch (error) {
      console.error("Error creating reminder:", error);
      toast({
        title: "Error creating reminder",
        description: "Failed to create reminder. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Reminder</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reminder Message</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter reminder message" 
                      {...field} 
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reminder_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
                      {...field}
                      value={field.value instanceof Date ? field.value.toISOString().slice(0, 16) : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="repeat_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repeat</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select repeat option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Do not repeat</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Reminder</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
