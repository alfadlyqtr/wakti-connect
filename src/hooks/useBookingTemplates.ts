
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import {
  fetchBookingTemplates,
  createBookingTemplate,
  updateBookingTemplate,
  deleteBookingTemplate,
  fetchTemplateAvailability,
  addTemplateAvailability,
  deleteTemplateAvailability,
  fetchTemplateExceptions,
  addTemplateException,
  deleteTemplateException,
  publishTemplate,
  BookingTemplateFormData,
  BookingTemplateWithRelations,
  BookingTemplateAvailability,
  BookingTemplateException
} from "@/services/booking";

export const useBookingTemplates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPublished, setFilterPublished] = useState<boolean | null>(null);
  const queryClient = useQueryClient();

  // Fetch templates
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['booking-templates'],
    queryFn: fetchBookingTemplates,
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
    staleTime: 30 * 1000,
    meta: {
      onError: (err: any) => {
        console.error("Booking templates fetch error:", err);
        toast({
          title: "Failed to load booking templates",
          description: err.message || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    }
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: (templateData: BookingTemplateFormData) => createBookingTemplate(templateData),
    onSuccess: () => {
      toast({
        title: "Template Created",
        description: "Your booking template has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['booking-templates'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create template",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: ({ templateId, data }: { templateId: string, data: Partial<BookingTemplateFormData> }) => 
      updateBookingTemplate(templateId, data),
    onSuccess: () => {
      toast({
        title: "Template Updated",
        description: "Your booking template has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['booking-templates'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update template",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: (templateId: string) => deleteBookingTemplate(templateId),
    onSuccess: () => {
      toast({
        title: "Template Deleted",
        description: "Your booking template has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['booking-templates'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete template",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  // Publish/unpublish template mutation
  const publishTemplateMutation = useMutation({
    mutationFn: ({ templateId, isPublished }: { templateId: string, isPublished: boolean }) => 
      publishTemplate(templateId, isPublished),
    onSuccess: (data) => {
      toast({
        title: data.is_published ? "Template Published" : "Template Unpublished",
        description: `Your booking template is now ${data.is_published ? "available" : "hidden"} to the public`,
      });
      queryClient.invalidateQueries({ queryKey: ['booking-templates'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update template status",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  // Fetch template availability
  const useTemplateAvailability = (templateId: string) => useQuery({
    queryKey: ['template-availability', templateId],
    queryFn: () => fetchTemplateAvailability(templateId),
    enabled: !!templateId,
    staleTime: 30 * 1000,
  });

  // Fetch template exceptions
  const useTemplateExceptions = (templateId: string) => useQuery({
    queryKey: ['template-exceptions', templateId],
    queryFn: () => fetchTemplateExceptions(templateId),
    enabled: !!templateId,
    staleTime: 30 * 1000,
  });

  // Add availability mutation
  const addAvailabilityMutation = useMutation({
    mutationFn: (availabilityData: Omit<BookingTemplateAvailability, 'id' | 'created_at' | 'updated_at'>) => 
      addTemplateAvailability(availabilityData),
    onSuccess: () => {
      toast({
        title: "Availability Added",
        description: "Your template availability has been added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['template-availability'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add availability",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  // Delete availability mutation
  const deleteAvailabilityMutation = useMutation({
    mutationFn: (availabilityId: string) => deleteTemplateAvailability(availabilityId),
    onSuccess: () => {
      toast({
        title: "Availability Removed",
        description: "Your template availability has been removed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['template-availability'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to remove availability",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  // Add exception mutation
  const addExceptionMutation = useMutation({
    mutationFn: (exceptionData: Omit<BookingTemplateException, 'id' | 'created_at' | 'updated_at'>) => 
      addTemplateException(exceptionData),
    onSuccess: () => {
      toast({
        title: "Exception Added",
        description: "Your template exception has been added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['template-exceptions'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add exception",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  // Delete exception mutation
  const deleteExceptionMutation = useMutation({
    mutationFn: (exceptionId: string) => deleteTemplateException(exceptionId),
    onSuccess: () => {
      toast({
        title: "Exception Removed",
        description: "Your template exception has been removed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['template-exceptions'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to remove exception",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  });

  // Filter templates based on search and filters
  const getFilteredTemplates = () => {
    const templatesList = data?.templates || [];
    
    return templatesList.filter((template) => {
      // Search filter
      const matchesSearch = searchQuery 
        ? template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      // Published status filter
      const matchesPublished = filterPublished === null 
        ? true 
        : template.is_published === filterPublished;
      
      return matchesSearch && matchesPublished;
    });
  };

  return {
    templates: data?.templates || [],
    filteredTemplates: getFilteredTemplates(),
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filterPublished,
    setFilterPublished,
    createTemplate: createTemplateMutation.mutate,
    isCreating: createTemplateMutation.isPending,
    updateTemplate: updateTemplateMutation.mutate,
    isUpdating: updateTemplateMutation.isPending,
    deleteTemplate: deleteTemplateMutation.mutate,
    isDeleting: deleteTemplateMutation.isPending,
    publishTemplate: publishTemplateMutation.mutate,
    isPublishing: publishTemplateMutation.isPending,
    useTemplateAvailability,
    useTemplateExceptions,
    addAvailability: addAvailabilityMutation.mutate,
    isAddingAvailability: addAvailabilityMutation.isPending,
    deleteAvailability: deleteAvailabilityMutation.mutate,
    isDeletingAvailability: deleteAvailabilityMutation.isPending,
    addException: addExceptionMutation.mutate,
    isAddingException: addExceptionMutation.isPending,
    deleteException: deleteExceptionMutation.mutate,
    isDeletingException: deleteExceptionMutation.isPending,
    refetch
  };
};
