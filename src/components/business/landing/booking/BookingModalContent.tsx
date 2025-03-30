
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useBookingSlots } from '@/hooks/useBookingSlots';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/auth';

interface BookingTemplate {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price?: number;
}

interface BookingModalContentProps {
  template: BookingTemplate;
  businessId: string;
  onClose: () => void;
}

export const BookingModalContent = ({ template, businessId, onClose }: BookingModalContentProps) => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState(user?.display_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // For now, just create dummy slots
  const availableSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !slot) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      // Show success message
    }, 1500);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Select a date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {date && (
        <div className="space-y-2">
          <Label htmlFor="time">Select a time</Label>
          <Select onValueChange={setSlot}>
            <SelectTrigger id="time">
              <SelectValue placeholder="Select a time slot" />
            </SelectTrigger>
            <SelectContent>
              {availableSlots.map((timeSlot) => (
                <SelectItem key={timeSlot} value={timeSlot}>
                  {timeSlot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
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
          placeholder="Email Address"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
        />
      </div>
      
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!date || !slot || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </div>
    </form>
  );
};
