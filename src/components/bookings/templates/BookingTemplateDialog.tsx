
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BookingTemplateForm from "./BookingTemplateForm";
import { BookingTemplateWithRelations, BookingTemplateFormData } from "@/types/booking.types";

interface BookingTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookingTemplateFormData) => Promise<void>;
  initialData?: BookingTemplateWithRelations;
  isPending: boolean;
}

const BookingTemplateDialog: React.FC<BookingTemplateDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isPending,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Booking Template" : "Create Booking Template"}
          </DialogTitle>
        </DialogHeader>
        
        <BookingTemplateForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onClose}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookingTemplateDialog;
