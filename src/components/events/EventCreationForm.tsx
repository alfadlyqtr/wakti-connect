
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, EventFormValues, EventFormTab } from "@/types/event.types";
import FormHeader from "./creation/FormHeader";
import FormTabs from "./creation/FormTabs";
import FormActions from "./creation/FormActions";
import { InvitationRecipient } from "@/types/invitation.types";
import useEditEventEffect from "./hooks/useEditEventEffect";
import { Event } from "@/types/event.types";

interface EventCreationFormProps {
  editEvent?: Event | null;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const EventCreationForm: React.FC<EventCreationFormProps> = ({ 
  editEvent, 
  onCancel, 
  onSuccess 
}) => {
  const [activeTab, setActiveTab] = useState<EventFormTab>("details");
  const [recipients, setRecipients] = useState<InvitationRecipient[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startDate: undefined,
      endDate: undefined,
      isAllDay: false,
    }
  });
  
  // Use the hook to load event data if in edit mode
  const { isLoading: isLoadingEvent } = useEditEventEffect({
    editEvent,
    form,
    setRecipients,
    setIsEditMode
  });

  const onSubmit = (data: EventFormValues) => {
    console.log("Form submitted:", data);
    if (onSuccess) {
      onSuccess();
    }
  };
  
  return (
    <div className="container mx-auto mt-10">
      <FormHeader 
        isEdit={isEditMode} 
        onCancel={onCancel}
      />
      
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          title={form.watch("title")}
          description={form.watch("description")}
          selectedDate={form.watch("startDate")}
          location={form.watch("location")}
          startTime="09:00" // You should get this from a state or form
          endTime="10:00"   // You should get this from a state or form
          customization={{
            background: { type: 'solid', value: '#ffffff' },
            font: { family: 'sans-serif', size: 'medium', color: '#333333' },
            buttons: {
              accept: { background: '#4CAF50', color: '#ffffff', shape: 'rounded' },
              decline: { background: '#f44336', color: '#ffffff', shape: 'rounded' }
            }
          }}
          onCustomizationChange={(customization) => console.log("Customization changed:", customization)}
          recipients={recipients}
          addRecipient={(recipient) => setRecipients([...recipients, recipient])}
          removeRecipient={(index) => {
            const newRecipients = [...recipients];
            newRecipients.splice(index, 1);
            setRecipients(newRecipients);
          }}
        />
        
        <FormActions 
          onPrev={() => {
            if (activeTab === "customize") setActiveTab("details");
            if (activeTab === "share") setActiveTab("customize");
          }}
          onNext={() => {
            if (activeTab === "details") setActiveTab("customize");
            if (activeTab === "customize") setActiveTab("share");
          }}
          isSubmitting={form.formState.isSubmitting}
          showSubmit={activeTab === "share"}
          submitLabel={isEditMode ? "Update Event" : "Create Event"}
        />
      </form>
    </div>
  );
};

export default EventCreationForm;
