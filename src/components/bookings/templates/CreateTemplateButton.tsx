
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import BookingTemplateDialog from "./BookingTemplateDialog";
import { BookingTemplateFormData } from "@/types/booking.types";

interface CreateTemplateButtonProps {
  onCreate: (data: BookingTemplateFormData) => Promise<any>;
  isCreating: boolean;
}

const CreateTemplateButton: React.FC<CreateTemplateButtonProps> = ({
  onCreate,
  isCreating
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreate = async (data: BookingTemplateFormData) => {
    try {
      await onCreate(data);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating template:", error);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        id="create-template-button"
      >
        <CalendarPlus className="h-4 w-4 mr-2" />
        Create Template
      </Button>

      <BookingTemplateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreate}
        isPending={isCreating}
      />
    </>
  );
};

export default CreateTemplateButton;
