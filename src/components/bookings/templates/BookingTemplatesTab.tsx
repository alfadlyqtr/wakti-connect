
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import BookingTemplatesList from "./BookingTemplatesList";
import BookingTemplateDialog from "./BookingTemplateDialog";
import CreateTemplateButton from "./CreateTemplateButton";
import TemplateAvailabilityManager from "./TemplateAvailabilityManager";
import { BookingTemplateWithRelations, BookingTemplateFormData } from "@/types/booking.types";
import { useBookingTemplates } from "@/hooks/useBookingTemplates";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

const BookingTemplatesTab: React.FC = () => {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  // Get the current user's ID on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setBusinessId(session.user.id);
      }
    };
    
    fetchCurrentUser();
  }, []);

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
  } = useBookingTemplates(businessId);

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
      await updateTemplate({ templateId: editTemplate.id, data });
      setEditTemplate(null);
    }
  };

  const handleManageAvailability = (template: BookingTemplateWithRelations) => {
    setAvailabilityTemplate(template);
  };

  // Handle create template action
  const handleCreateTemplate = async (data: BookingTemplateFormData) => {
    try {
      if (!businessId) {
        throw new Error("Business ID not found");
      }
      
      const templateData = {
        ...data,
        business_id: businessId
      };
      
      await createTemplate(templateData);
      return Promise.resolve();
    } catch (error) {
      console.error("Error in create template:", error);
      return Promise.reject(error);
    }
  };

  // Display loading state if we're still fetching the business ID
  if (!businessId) {
    return (
      <div className="flex justify-center p-4 sm:p-8">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-4 sm:p-8">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <p className="text-destructive text-sm sm:text-base">Error loading templates. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 sm:h-10 text-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
          <ToggleGroup 
            type="single" 
            value={filterPublished === null ? "all" : filterPublished ? "published" : "drafts"}
            onValueChange={(value) => {
              if (value === "all") setFilterPublished(null);
              else if (value === "published") setFilterPublished(true);
              else if (value === "drafts") setFilterPublished(false);
            }}
            className="h-8 sm:h-9 text-xs sm:text-sm"
          >
            <ToggleGroupItem value="all" className="px-2 sm:px-3">All</ToggleGroupItem>
            <ToggleGroupItem value="published" className="px-2 sm:px-3">Published</ToggleGroupItem>
            <ToggleGroupItem value="drafts" className="px-2 sm:px-3">Drafts</ToggleGroupItem>
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
