
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, ArrowRight } from 'lucide-react';
import { toast } from "sonner";
import { useEventLocation } from '@/hooks/events/useEventLocation';
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
      language: 'auto',
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
    <MeetingFormLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-wakti-navy/10">
          <div className="h-10 w-10 rounded-lg bg-wakti-navy text-wakti-beige flex items-center justify-center">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-wakti-navy">Meeting Details</h2>
            <p className="text-sm text-wakti-navy/70">
              Let WAKTI AI know about your meeting context
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-wakti-navy font-medium">Meeting Language</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10 bg-white border-wakti-navy/20">
                        <SelectValue placeholder="Select meeting language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="mixed">Mixed (English & Arabic)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="sessionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-wakti-navy font-medium">Session Type</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Staff meeting or English lecture" 
                        {...field}
                        className="h-10 bg-white border-wakti-navy/20"
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
                    <FormLabel className="text-wakti-navy font-medium">Location</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input 
                          placeholder="e.g., Oryx Tower, Doha College" 
                          {...field}
                          className="h-10 bg-white border-wakti-navy/20"
                        />
                      </FormControl>
                      <Button 
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 shrink-0 border-wakti-navy/20 hover:bg-wakti-beige"
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
                    <FormLabel className="text-wakti-navy font-medium">Hosted By</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Jabor Abdullah" 
                        {...field}
                        className="h-10 bg-white border-wakti-navy/20"
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
                    <FormLabel className="text-wakti-navy font-medium">Attendees</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., John, Alanoud, Mozah, Hassan" 
                        {...field}
                        className="h-10 bg-white border-wakti-navy/20"
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
                    <FormLabel className="text-wakti-navy font-medium">Agenda</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Project deadline, Final exams" 
                        {...field}
                        className="h-20 min-h-[80px] bg-white border-wakti-navy/20 resize-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between gap-4 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-wakti-navy text-white hover:bg-wakti-navy/90 h-10"
              >
                Start Recording
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={onSkip}
                className="flex-1 border-wakti-navy/20 text-wakti-navy hover:bg-wakti-beige h-10"
              >
                Skip
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </MeetingFormLayout>
  );
};
