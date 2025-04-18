
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Building, MapPin, Users } from 'lucide-react';

const formSchema = z.object({
  sessionType: z.string().min(2, {
    message: 'Session type must be at least 2 characters.',
  }),
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

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <Card className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="sessionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>Session Type</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Staff Meeting, English Lecture" 
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hostedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Hosted By</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Jabor Abdullah" 
                    {...field} 
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
                <FormLabel className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Location</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Oryx Tower, Doha College" 
                    {...field} 
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
                <FormLabel className="flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span>Attendees</span>
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g., John, Alanoud, Mozah, Hassan" 
                    {...field} 
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
                <FormLabel>Agenda</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g., Project Deadline, Final Exams" 
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button type="submit" variant="success">Skip and Start</Button>
              <span className="text-sm text-muted-foreground">
                😊 No worries! WAKTI AI will help you pick up
              </span>
            </div>
          </div>
        </form>
      </Form>
    </Card>
  );
};
