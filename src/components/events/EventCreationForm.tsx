
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, EventFormValues } from "@/types/event.types";
import FormHeader from "./creation/FormHeader";
import FormTabs from "./creation/FormTabs";
import FormActions from "./creation/FormActions";
import { InvitationRecipient } from "@/types/invitation.types";
import useEditEventEffect from "./hooks/useEditEventEffect";
import { EventFormTab } from "@/types/form.types";

interface EventCreationFormProps {
  editEvent?: any;
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
  const { isLoading: isLoadingEvent } = useEditEventEffect(
    form,
    setRecipients,
    setIsEditMode
  );
  
  return (
    <div className="container mx-auto mt-10">
      <FormHeader 
        isEdit={isEditMode} 
        onCancel={onCancel}
      />
      
      <FormTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
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
        isSubmitting={false}
        showSubmit={activeTab === "share"}
        submitLabel={isEditMode ? "Update Event" : "Create Event"}
      />
    </div>
  );
};

export default EventCreationForm;
