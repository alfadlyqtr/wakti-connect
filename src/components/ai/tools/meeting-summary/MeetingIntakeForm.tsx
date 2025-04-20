
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Users, GraduationCap, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useEventLocation } from '@/hooks/events/useEventLocation';
import { motion } from 'framer-motion';
import MeetingFormLayout from './MeetingFormLayout';

const formSchema = z.object({
  sessionType: z.string().optional(),
  hostedBy: z.string().optional(),
  location: z.string().optional(),
  attendees: z.string().optional(),
  agenda: z.string().optional(),
});

interface MeetingIntakeFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onSkip: () => void;
}

export const MeetingIntakeForm: React.FC<MeetingIntakeFormProps> = ({ onSubmit, onSkip }) => {
  const { getCurrentLocation, location, updateLocation, isGettingLocation, error } = useEventLocation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sessionType: '',
      hostedBy: '',
      location: '',
      attendees: '',
      agenda: '',
    },
  });

  React.useEffect(() => {
    if (location) {
      form.setValue('location', location);
    }
  }, [location, form]);

  const handleGetCurrentLocation = async () => {
    const success = await getCurrentLocation();
    if (!success && error) {
      toast.error(error || 'Could not get current location');
    }
  };

  return (
    <MeetingFormLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-6 border-b">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Meeting Details</h2>
            <p className="text-sm text-muted-foreground">
              Let WAKTI AI know about your meeting context
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="sessionType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Session Type
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Staff meeting or English lecture" 
                      {...field} 
                      className="h-11"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input 
                        placeholder="e.g., Oryx Tower, Doha College" 
                        {...field} 
                        className="h-11"
                      />
                    </FormControl>
                    <Button 
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 shrink-0"
                      onClick={handleGetCurrentLocation}
                      disabled={isGettingLocation}
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hostedBy"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Hosted By
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Jabor Abdullah" 
                      {...field} 
                      className="h-11"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attendees"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Attendees
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., John, Alanoud, Mozah, Hassan" 
                      {...field} 
                      className="min-h-[100px] resize-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agenda"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base">Agenda</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Project deadline, Final exams" 
                      {...field} 
                      className="min-h-[100px] resize-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-between gap-4 pt-4">
              <Button 
                type="submit" 
                className="flex-1 h-11"
              >
                Submit
              </Button>
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onSkip} 
                  className="w-full h-11 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:border-purple-300 hover:from-purple-100 hover:to-blue-100"
                >
                  Skip
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </form>
        </Form>
      </div>
    </MeetingFormLayout>
  );
};
