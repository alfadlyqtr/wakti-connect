
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Users, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { useEventLocation } from '@/hooks/events/useEventLocation';
import { motion } from 'framer-motion';

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

  // Watch for location changes from useEventLocation and update form
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
    <Card className="w-full p-8 space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        Don't feel like filling anything up? No worries 😊👍 WAKTI AI will listen carefully and pick it up.
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="sessionType"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>Session Type</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Staff meeting or English lecture" 
                    {...field} 
                    className="py-3"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Location</span>
                </FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input 
                      placeholder="e.g., Oryx Tower, Doha College" 
                      {...field} 
                      className="py-3"
                    />
                  </FormControl>
                  <Button 
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-[42px] w-[42px]"
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
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Hosted By</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Jabor Abdullah" 
                    {...field} 
                    className="py-3"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attendees"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Attendees</span>
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g., John, Alanoud, Mozah, Hassan" 
                    {...field} 
                    className="min-h-[100px]"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agenda"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Agenda</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g., Project deadline, Final exams" 
                    {...field} 
                    className="min-h-[100px]"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-between space-x-4 pt-4">
            <Button 
              type="submit" 
              className="flex-1"
            >
              Submit
            </Button>
            <motion.div 
              className="flex-1"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="button" 
                variant="outline" 
                onClick={onSkip} 
                className="w-full bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:border-purple-300 hover:from-purple-100 hover:to-blue-100 hover:shadow-md transition-all duration-300"
              >
                Skip and Start
              </Button>
            </motion.div>
          </div>
        </form>
      </Form>
    </Card>
  );
};
