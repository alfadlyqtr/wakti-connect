import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Users, GraduationCap, ArrowRight } from 'lucide-react';
import { toast } from "sonner";
import { useEventLocation } from '@/hooks/events/useEventLocation';
import { motion } from 'framer-motion';
import MeetingFormLayout from './MeetingFormLayout';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  sessionType: z.string().optional(),
  hostedBy: z.string().optional(),
  location: z.string().optional(),
  attendees: z.string().optional(),
  agenda: z.string().optional(),
  language: z.string().min(1, 'Please select a language'),
});

interface MeetingIntakeFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onSkip: () => void;
}

export const MeetingIntakeForm: React.FC<MeetingIntakeFormProps> = ({ onSubmit, onSkip }) => {
  const { handleLocationChange, location, isGettingLocation } = useEventLocation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sessionType: '',
      hostedBy: '',
      location: '',
      attendees: '',
      agenda: '',
      language: 'mixed',
    },
  });

  React.useEffect(() => {
    if (location) {
      form.setValue('location', location);
    }
  }, [location, form]);

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      
      const { data: geoData, error: geoError } = await supabase.functions.invoke('tomtom-geocode', {
        body: { query: `${latitude},${longitude}` }
      });

      if (geoError) {
        toast.error("Could not get location details");
        return;
      }

      const locationStr = `Current Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
      handleLocationChange(locationStr, 'manual');
      
    } catch (error: any) {
      console.error("Error getting location:", error);
      toast.error(error.message || "Could not get your location");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-6">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-medium">Meeting Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select meeting language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="arabic">Arabic</SelectItem>
                      <SelectItem value="mixed">Mixed (English & Arabic)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="sessionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Session Type</FormLabel>
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
                  <FormItem>
                    <FormLabel className="text-base font-medium">Location</FormLabel>
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
                  <FormItem>
                    <FormLabel className="text-base font-medium">Hosted By</FormLabel>
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
                  <FormItem>
                    <FormLabel className="text-base font-medium">Attendees</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., John, Alanoud, Mozah, Hassan" 
                        {...field}
                        className="min-h-[80px] resize-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agenda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Agenda</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Project deadline, Final exams" 
                        {...field}
                        className="min-h-[80px] resize-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between gap-4 pt-6">
              <Button 
                type="submit" 
                size="lg"
                className="flex-1"
              >
                Start Recording
              </Button>
              <Button 
                type="button" 
                variant="outline"
                size="lg"
                onClick={onSkip}
                className="flex-1"
              >
                Skip
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
