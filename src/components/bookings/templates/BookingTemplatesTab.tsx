
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import BookingTemplatesList from "./BookingTemplatesList";
import BookingTemplateDialog from "./BookingTemplateDialog";
import CreateTemplateButton from "./CreateTemplateButton";
import TemplateAvailabilityManager from "./TemplateAvailabilityManager";
import { BookingTemplateWithRelations, BookingTemplateFormData } from "@/types/booking.types";
import { useBookingTemplates } from "@/hooks/useBookingTemplates";

const BookingTemplatesTab: React.FC = () => {
  const {
    templates,
    filteredTemplates,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filterPublished,
    setFilterPublished,
    createTemplate,
    isCreating,
    updateTemplate,
    isUpdating,
    deleteTemplate,
    isDeleting,
    publishTemplate,
    isPublishing,
    useTemplateAvailability,
    useTemplateExceptions,
    addAvailability,
    isAddingAvailability,
    deleteAvailability,
    isDeletingAvailability,
    addException,
    isAddingException,
    deleteException,
    isDeletingException
  } = useBookingTemplates();

  const [editTemplate, setEditTemplate] = useState<BookingTemplateWithRelations | null>(null);
  const [availabilityTemplate, setAvailabilityTemplate] = useState<BookingTemplateWithRelations | null>(null);

  // Fetch availability and exceptions for the selected template
  const {
    data: availability,
    isLoading: isLoadingAvailability
  } = useTemplateAvailability(availabilityTemplate?.id || "");

  const {
    data: exceptions,
    isLoading: isLoadingExceptions
  } = useTemplateExceptions(availabilityTemplate?.id || "");

  const handleEdit = (template: BookingTemplateWithRelations) => {
    setEditTemplate(template);
  };

  const handleUpdate = async (data: BookingTemplateFormData) => {
    if (editTemplate) {
      await Promise.resolve(updateTemplate({ templateId: editTemplate.id, data }));
      setEditTemplate(null);
    }
  };

  const handleManageAvailability = (template: BookingTemplateWithRelations) => {
    setAvailabilityTemplate(template);
  };

  // Wrapper to convert mutation to Promise for CreateTemplateButton
  const handleCreateTemplate = (data: BookingTemplateFormData) => {
    return Promise.resolve(createTemplate(data));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">Error loading templates. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <ToggleGroup 
            type="single" 
            value={filterPublished === null ? "all" : filterPublished ? "published" : "drafts"}
            onValueChange={(value) => {
              if (value === "all") setFilterPublished(null);
              else if (value === "published") setFilterPublished(true);
              else if (value === "drafts") setFilterPublished(false);
            }}
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="published">Published</ToggleGroupItem>
            <ToggleGroupItem value="drafts">Drafts</ToggleGroupItem>
          </ToggleGroup>

          <CreateTemplateButton
            onCreate={handleCreateTemplate}
            isCreating={isCreating}
          />
        </div>
      </div>

      <BookingTemplatesList
        templates={filteredTemplates}
        onEdit={handleEdit}
        onDelete={deleteTemplate}
        onPublish={(templateId, isPublished) => publishTemplate({ templateId, isPublished })}
        onManageAvailability={handleManageAvailability}
        isDeleting={isDeleting}
        isPublishing={isPublishing}
      />

      {/* Edit Template Dialog */}
      {editTemplate && (
        <BookingTemplateDialog
          isOpen={!!editTemplate}
          onClose={() => setEditTemplate(null)}
          onSubmit={handleUpdate}
          initialData={editTemplate}
          isPending={isUpdating}
        />
      )}

      {/* Availability Manager Dialog */}
      {availabilityTemplate && (
        <TemplateAvailabilityManager
          isOpen={!!availabilityTemplate}
          onClose={() => setAvailabilityTemplate(null)}
          template={availabilityTemplate}
          availability={availability || []}
          exceptions={exceptions || []}
          isLoadingAvailability={isLoadingAvailability}
          isLoadingExceptions={isLoadingExceptions}
          onAddAvailability={(data) => addAvailability({
            ...data,
            template_id: availabilityTemplate.id
          } as any)}
          onDeleteAvailability={deleteAvailability}
          onAddException={(data) => addException({
            ...data,
            template_id: availabilityTemplate.id
          } as any)}
          onDeleteException={deleteException}
          isAddingAvailability={isAddingAvailability}
          isDeletingAvailability={isDeletingAvailability}
          isAddingException={isAddingException}
          isDeletingException={isDeletingException}
        />
      )}
    </div>
  );
};

export default BookingTemplatesTab;
