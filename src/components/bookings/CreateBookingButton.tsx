
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "@/services/booking";
import { BookingFormData } from "@/types/booking.types";
import BookingForm from "./BookingForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";

const CreateBookingButton = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  
  // Mutation for creating a booking
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: BookingFormData) => {
      return await createBooking(bookingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: t('booking.preBookingCreated'),
        description: t('booking.preBookingCreatedDesc'),
        variant: "success"
      });
      setOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: t('booking.errorCreatingPreBooking'),
        description: error.message || t('common.error'),
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
        <Button 
          id="create-booking-button"
          size={isMobile ? "sm" : "default"}
          className={isMobile ? "h-8 px-2 py-1 text-xs" : ""}
        >
          <PlusCircle className="h-4 w-4 mr-1 sm:mr-2" />
          {isMobile ? t('booking.addBooking') : t('booking.enterManualBooking')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('booking.createNewPreBooking')}</DialogTitle>
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
