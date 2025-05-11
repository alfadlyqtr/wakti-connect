
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { BookingTemplateWithRelations } from '@/types/booking.types';
import { formatCurrency } from '@/utils/formatUtils';
import { Loader2, CalendarIcon, Clock } from 'lucide-react';

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00'
  ]);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [step, setStep] = useState(1);
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    // In a real app, fetch available times for this date
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleNext = () => {
    if (step === 1 && selectedDate && selectedTime) {
      setStep(2);
    } else if (step === 2) {
      handleBookingSubmit();
    }
  };
  
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };
  
  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedTime) return;
    
    setIsLoading(true);
    try {
      // In a real app, submit the booking to your backend
      console.log('Creating booking for:', {
        templateId: template.id,
        businessId,
        date: selectedDate,
        time: selectedTime,
        customer: customerDetails
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert('Booking created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const isNextDisabled = () => {
    if (step === 1) {
      return !selectedDate || !selectedTime;
    } else if (step === 2) {
      return !customerDetails.name || !customerDetails.email;
    }
    return false;
  };
  
  // Render date and time selection step
  if (step === 1) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{template.name}</p>
            {template.price && (
              <p className="text-sm text-muted-foreground">{formatCurrency(template.price)}</p>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            <span>{template.duration} minutes</span>
          </div>
        </div>
        
        <div className="border rounded-md p-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="w-full"
            disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
          />
        </div>
        
        {selectedDate && (
          <div>
            <p className="font-medium mb-2">Available Times</p>
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map(time => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleNext} 
            disabled={isNextDisabled()}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }
  
  // Render customer information step
  return (
    <div className="space-y-4">
      <div>
        <p className="font-medium mb-4">Enter Your Details</p>
        <div className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full p-2 border rounded-md"
              value={customerDetails.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full p-2 border rounded-md"
              value={customerDetails.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone (optional)</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="w-full p-2 border rounded-md"
              value={customerDetails.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-muted/20 p-3 rounded-md">
        <p className="font-medium">Booking Summary</p>
        <div className="text-sm text-muted-foreground mt-1">
          <p>{template.name}</p>
          <p>Date: {selectedDate?.toLocaleDateString()}</p>
          <p>Time: {selectedTime}</p>
          {template.price && <p>Price: {formatCurrency(template.price)}</p>}
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button 
          onClick={handleBookingSubmit} 
          disabled={isNextDisabled() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            'Confirm Booking'
          )}
        </Button>
      </div>
    </div>
  );
};

export default BookingModalContent;
