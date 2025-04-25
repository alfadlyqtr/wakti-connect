
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { User } from '@/hooks/auth/types'; // Using our extended User type
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface BookingModalContentProps {
  template: any;
  businessId: string;
  onClose: () => void;
}

const BookingModalContent: React.FC<BookingModalContentProps> = ({
  template,
  businessId,
  onClose,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState<string>((user as User)?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const availableTimes = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time for your booking.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format the datetime for database storage
      const bookingDate = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      bookingDate.setHours(hours, minutes);
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          business_id: businessId,
          template_id: template.id,
          title: template.name || "Booking", // Add title field which is required
          customer_name: name || (user as User)?.name || 'Guest',
          customer_email: email || user?.email,
          customer_phone: phone,
          description: notes, // Use description field instead of notes
          start_time: bookingDate.toISOString(),
          end_time: new Date(bookingDate.getTime() + (template.duration || 60) * 60000).toISOString(),
          status: 'pending',
          customer_id: user?.id || null // Use customer_id to associate with the user account
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Booking Successful",
        description: "Your booking request has been submitted successfully.",
      });
      
      onClose();
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "There was a problem creating your booking.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Select Date</Label>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="border rounded-md"
          disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Select Time</Label>
        <div className="grid grid-cols-4 gap-2">
          {availableTimes.map((time) => (
            <Button
              key={time}
              type="button"
              variant={selectedTime === time ? "default" : "outline"}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Enter your name" 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter your email" 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          placeholder="Enter your phone number" 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea 
          id="notes" 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)} 
          placeholder="Any special requests or information" 
          rows={3}
        />
      </div>
      
      <div className="pt-2 flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Processing...
            </>
          ) : (
            'Confirm Booking'
          )}
        </Button>
      </div>
    </form>
  );
};

export default BookingModalContent;
