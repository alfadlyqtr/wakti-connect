
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchPublishedBookingTemplates } from "@/services/booking/templates/fetchTemplates";
import { BookingTemplateWithRelations } from "@/types/booking.types";

interface UseBookingTemplatesReturn {
  templates: BookingTemplateWithRelations[];
  isLoading: boolean;
  error: Error | null;
  filteredTemplates: BookingTemplateWithRelations[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterPublished: boolean | null;
  setFilterPublished: (value: boolean | null) => void;
  createTemplate: Function;
  updateTemplate: Function;
  deleteTemplate: Function;
  publishTemplate: Function;
  useTemplateAvailability: Function;
  useTemplateExceptions: Function;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isPublishing: boolean;
  addAvailability: Function;
  deleteAvailability: Function;
  addException: Function;
  deleteException: Function;
  isAddingAvailability: boolean;
  isDeletingAvailability: boolean;
  isAddingException: boolean;
  isDeletingException: boolean;
}

export const useBookingTemplates = (businessId?: string | null): UseBookingTemplatesReturn => {
  const [templates, setTemplates] = useState<BookingTemplateWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPublished, setFilterPublished] = useState<boolean | null>(null);

  // Filtered templates based on search query and publish status
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPublished = filterPublished === null || template.is_published === filterPublished;
    
    return matchesSearch && matchesPublished;
  });

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!businessId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const fetchedTemplates = await fetchPublishedBookingTemplates(businessId);
        setTemplates(fetchedTemplates);
        setError(null);
      } catch (err) {
        console.error('Error fetching booking templates:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch booking templates'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [businessId]);

  // These are placeholders to meet the interface requirements - in a real implementation
  // they would have actual functionality
  const createTemplate = async () => {};
  const updateTemplate = async () => {};
  const deleteTemplate = async () => {};
  const publishTemplate = async () => {};
  const useTemplateAvailability = () => ({ data: [], isLoading: false });
  const useTemplateExceptions = () => ({ data: [], isLoading: false });
  const addAvailability = async () => {};
  const deleteAvailability = async () => {};
  const addException = async () => {};
  const deleteException = async () => {};

  return {
    templates,
    isLoading,
    error,
    filteredTemplates,
    searchQuery,
    setSearchQuery,
    filterPublished,
    setFilterPublished,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    publishTemplate,
    useTemplateAvailability,
    useTemplateExceptions,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isPublishing: false,
    addAvailability,
    deleteAvailability,
    addException,
    deleteException,
    isAddingAvailability: false,
    isDeletingAvailability: false,
    isAddingException: false,
    isDeletingException: false
  };
};
