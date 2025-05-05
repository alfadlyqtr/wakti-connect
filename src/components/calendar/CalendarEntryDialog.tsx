
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarEntry } from '@/types/calendar.types';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { createManualEntry } from '@/services/calendar/manualEntriesService';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface CalendarEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  location: z.string().optional(),
  isAllDay: z.boolean().default(false),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const CalendarEntryDialog: React.FC<CalendarEntryDialogProps> = ({
  open,
  onOpenChange,
  selectedDate,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      isAllDay: false,
      startTime: '09:00',
      endTime: '10:00',
    },
  });

  // Reset form when dialog opens with the selected date
  useEffect(() => {
    if (open) {
      form.reset({
        title: '',
        description: '',
        location: '',
        isAllDay: false,
        startTime: '09:00',
        endTime: '10:00',
      });
    }
  }, [open, form, selectedDate]);

  // Get current user ID
  useEffect(() => {
    supabase.auth.getSession().then((result) => {
      const id = result.data?.session?.user?.id;
      setUserId(id || null);
    });
  }, []);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (!userId) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create calendar entries',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const entry: CalendarEntry = {
        title: values.title,
        description: values.description,
        location: values.location,
        date: selectedDate,
        startTime: values.isAllDay ? undefined : values.startTime,
        endTime: values.isAllDay ? undefined : values.endTime,
        isAllDay: values.isAllDay,
      };

      const { error } = await createManualEntry(userId, entry);

      if (error) {
        throw new Error(error.message);
      }

      // Invalidate calendar events query to refresh data
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });

      toast({
        title: 'Calendar Entry Created',
        description: `${entry.title} has been added to your calendar.`,
      });

      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating calendar entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to create calendar entry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Calendar Entry</DialogTitle>
          <DialogDescription>
            Create a new entry for {format(selectedDate, 'MMMM d, yyyy')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Meeting with client" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Details about this entry..." 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Office, Zoom, etc." 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isAllDay"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>All-day event</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!form.watch('isAllDay') && (
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Entry'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
