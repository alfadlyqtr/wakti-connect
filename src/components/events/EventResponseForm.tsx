
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { respondToInvitation } from './respondToInvitation';

interface EventResponseFormProps {
  eventId: string;
  eventTitle?: string;
}

const EventResponseForm: React.FC<EventResponseFormProps> = ({ eventId, eventTitle }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleResponseSubmit = async (responseType: 'accepted' | 'declined') => {
    if (!name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter your name to respond to this invitation",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await respondToInvitation(eventId, responseType, { name });
      
      if (result.success) {
        setSubmitted(true);
        toast({
          title: "Response submitted",
          description: `You have ${responseType} the invitation`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit your response",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Response Submitted</CardTitle>
          <CardDescription>Thank you for your response!</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your response to {eventTitle || "the event"} has been recorded.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Respond to Invitation</CardTitle>
        <CardDescription>Enter your name to respond to {eventTitle || "this event"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full items-center gap-2">
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => handleResponseSubmit('declined')}
          disabled={isSubmitting}
        >
          Decline
        </Button>
        <Button
          onClick={() => handleResponseSubmit('accepted')}
          disabled={isSubmitting}
        >
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventResponseForm;
