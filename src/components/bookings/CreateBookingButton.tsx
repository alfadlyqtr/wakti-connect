
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "@/services/booking";
import { BookingFormData } from "@/types/booking.types";
import BookingForm from "./BookingForm";

const CreateBookingButton = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Mutation for creating a booking
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: BookingFormData) => {
      return await createBooking(bookingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Booking Created",
        description: "The booking has been created successfully.",
        variant: "success"
      });
      setOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Booking",
        description: error.message || "An error occurred while creating the booking.",
        variant: "destructive"
      });
    }
  });
  
  const handleSubmit = async (data: BookingFormData) => {
    await createBookingMutation.mutate(data);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id="create-booking-button">
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
        </DialogHeader>
        <BookingForm 
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isPending={createBookingMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateBookingButton;
