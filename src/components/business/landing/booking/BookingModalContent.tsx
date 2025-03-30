
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useBookingSlots } from '@/hooks/useBookingSlots';
import { BookingTemplateWithRelations } from '@/types/booking.types';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface BookingModalContentProps {
  template: BookingTemplateWithRelations;
  businessId: string;
  onClose: () => void;
}

export const BookingModalContent: React.FC<BookingModalContentProps> = ({
  template,
  businessId,
  onClose
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const { slots, isLoading } = useBookingSlots(template.id, selectedDate);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsUserLoggedIn(!!session);
    };
    
    checkSession();
  }, []);
  
  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a date and time to book."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format date and time for booking
      const bookingUrl = `/booking/${businessId}/${template.id}?date=${format(selectedDate, 'yyyy-MM-dd')}&time=${encodeURIComponent(selectedSlot)}`;
      
      // Navigate to the full booking page
      navigate(bookingUrl);
      onClose();
    } catch (error) {
      console.error('Error initiating booking:', error);
      toast({
        variant: "destructive",
        title: "Booking Error",
        description: "There was a problem initiating your booking. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Label className="text-base font-semibold">Service: {template.name}</Label>
        {template.price && (
          <p className="text-sm mt-1">Price: ${template.price}</p>
        )}
        {template.duration && (
          <p className="text-sm">Duration: {template.duration} minutes</p>
        )}
      </div>
      
      <div>
        <Label className="text-base">Select Date</Label>
        <div className="mt-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => 
              date < new Date(new Date().setHours(0, 0, 0, 0)) || 
              date > addDays(new Date(), 30)
            }
            className="rounded-md border mx-auto"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-base">Available Times</Label>
        <div className="mt-2">
          {isLoading ? (
            <div className="py-4 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : slots && slots.length > 0 ? (
            <RadioGroup value={selectedSlot || ''} onValueChange={setSelectedSlot}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {slots.map((slot) => (
                  <div key={slot} className="flex items-center space-x-2">
                    <RadioGroupItem value={slot} id={`slot-${slot}`} />
                    <Label htmlFor={`slot-${slot}`} className="cursor-pointer">
                      {slot}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              No available slots for this date.
            </p>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleBooking} 
          disabled={!selectedDate || !selectedSlot || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : "Continue to Book"}
        </Button>
      </div>
    </div>
  );
};
