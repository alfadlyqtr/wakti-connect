
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventFormTab } from "@/types/form.types";
import { EventCustomization } from "@/types/event.types";
import { InvitationRecipient } from "@/types/invitation.types";
import DetailsTab from "./DetailsTab";
import CustomizeTab from "../customize/CustomizeTab";
import ShareTab from "./ShareTab";
import FormActions from "./FormActions";

interface FormTabsProps {
  activeTab: EventFormTab;
  setActiveTab: (tab: EventFormTab) => void;
  register: any;
  errors: any;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  isAllDay: boolean;
  setIsAllDay: (isAllDay: boolean) => void;
  location: string;
  locationType: 'manual' | 'google_maps';
  mapsUrl?: string;
  handleLocationChange: (value: string, type: 'manual' | 'google_maps', mapsUrl?: string) => void;
  handleNextTab: () => void;
  handlePrevTab: () => void;
  customization: EventCustomization;
  setCustomization: (customization: EventCustomization) => void;
  shareTab: string;
  setShareTab: (tab: string) => void;
  recipients: InvitationRecipient[];
  addRecipient: (recipient: InvitationRecipient) => void;
  removeRecipient: (index: number) => void;
  handleSendEmail: (email: string) => void;
  isSubmitting: boolean;
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  isEdit?: boolean;
}

const FormTabs: React.FC<FormTabsProps> = ({
  activeTab,
  setActiveTab,
  register,
  errors,
  selectedDate,
  setSelectedDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  isAllDay,
  setIsAllDay,
  location,
  locationType,
  mapsUrl,
  handleLocationChange,
  handleNextTab,
  handlePrevTab,
  customization,
  setCustomization,
  shareTab,
  setShareTab,
  recipients,
  addRecipient,
  removeRecipient,
  handleSendEmail,
  isSubmitting,
  title,
  description,
  setTitle,
  setDescription,
  isEdit = false
}) => {
  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'customize', label: 'Design' },
    { id: 'share', label: 'Share' }
  ];

  return (
    <div>
      <TabsList className="w-full grid grid-cols-3 mb-4">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            onClick={() => setActiveTab(tab.id as EventFormTab)}
            disabled={tab.id === 'share' && !title.trim()}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <Tabs value={activeTab} className="space-y-4">
        <TabsContent value="details" className="space-y-4">
          <DetailsTab
            register={register}
            errors={errors}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            isAllDay={isAllDay}
            setIsAllDay={setIsAllDay}
            location={location}
            locationType={locationType}
            mapsUrl={mapsUrl}
            handleLocationChange={handleLocationChange}
            handleNextTab={handleNextTab}
            title={title}
            description={description}
            setTitle={setTitle}
            setDescription={setDescription}
            isEdit={isEdit}
          />
        </TabsContent>

        <TabsContent value="customize" className="space-y-4">
          <CustomizeTab
            customization={customization}
            onCustomizationChange={setCustomization}
            title={title}
            description={description}
            location={location}
            selectedDate={selectedDate}
            startTime={startTime}
            endTime={endTime}
          />
          <FormActions
            onPrev={handlePrevTab}
            onNext={handleNextTab}
            showSubmit={false}
          />
        </TabsContent>

        <TabsContent value="share" className="space-y-4">
          <ShareTab
            activeTab={shareTab}
            setActiveTab={setShareTab}
            recipients={recipients}
            addRecipient={addRecipient}
            removeRecipient={removeRecipient}
            handleSendEmail={handleSendEmail}
            eventTitle={title}
            customization={customization}
          />
          <FormActions
            onPrev={handlePrevTab}
            onNext={() => {}}
            isSubmitting={isSubmitting}
            showSubmit={true}
            submitLabel={isEdit ? "Update Event" : "Create Event"}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormTabs;
