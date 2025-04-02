import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, EventFormValues } from "@/types/event.types";
import FormHeader from "./creation/FormHeader";
import FormTabs from "./creation/FormTabs";
import FormActions from "./creation/FormActions";
import { InvitationRecipient } from "@/types/invitation.types";
import useEditEventEffect from "./hooks/useEditEventEffect";

const EventCreationForm = () => {
  const [activeTab, setActiveTab] = useState<string>("details");
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
  const { isLoading: isLoadingEvent } = useEditEventEffect(
    form,
    setRecipients,
    setIsEditMode
  );
  
  return (
    <div className="container mx-auto mt-10">
      <FormHeader isEditMode={isEditMode} isLoading={isLoadingEvent} />
      
      <FormTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <FormActions 
        form={form}
        activeTab={activeTab}
        recipients={recipients}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default EventCreationForm;
