
import { useCallback, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fromTable } from "@/integrations/supabase/helper";
import { toast } from "@/components/ui/use-toast";
import {
  BookingTemplateFormData,
  BookingTemplateWithRelations,
  BookingTemplateAvailability,
  BookingTemplateException
} from "@/types/booking.types";
import {
  createBookingTemplate,
  updateBookingTemplate,
  deleteBookingTemplate,
  publishTemplate,
  fetchTemplateAvailability,
  fetchTemplateExceptions,
  addTemplateAvailability,
  deleteTemplateAvailability,
  addTemplateException,
  deleteTemplateException
} from "@/services/booking/templates";

export const useBookingTemplates = (businessId?: string | null) => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPublished, setFilterPublished] = useState<boolean | null>(null);
  const [currentBusinessId, setCurrentBusinessId] = useState<string | null>(null);

  // If businessId is not provided, try to get it from the current user
  useEffect(() => {
    if (businessId) {
      setCurrentBusinessId(businessId);
      return;
    }

    const fetchCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setCurrentBusinessId(session.user.id);
      }
    };
    
    fetchCurrentUser();
  }, [businessId]);

  // Fetch booking templates
  const templatesQuery = useQuery({
    queryKey: ['bookingTemplates', currentBusinessId],
    queryFn: async () => {
      if (!currentBusinessId) {
        console.log("No business ID available for template fetch");
        return [];
      }
      
      console.log("Fetching templates for business ID:", currentBusinessId);
      
      const { data, error } = await fromTable('booking_templates')
        .select(`
          *,
          service:service_id (
            name,
            description,
            price
          ),
          staff:staff_assigned_id (
            name
          )
        `)
        .eq('business_id', currentBusinessId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching booking templates:", error);
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} templates for business ${currentBusinessId}`);
      return data as BookingTemplateWithRelations[];
    },
    enabled: !!currentBusinessId
  });

  // Filter templates based on search query and published filter
  const filteredTemplates = useCallback(() => {
    const templates = templatesQuery.data || [];
    console.log(`Filtering ${templates.length} templates`);
    
    return templates.filter(template => {
      // Apply search filter
      const matchesSearch = !searchQuery || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Apply published filter
      const matchesPublished = filterPublished === null || template.is_published === filterPublished;
      
      return matchesSearch && matchesPublished;
    });
  }, [templatesQuery.data, searchQuery, filterPublished]);

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (data: BookingTemplateFormData) => {
      console.log("Creating template with data:", data);
      if (!data.business_id && currentBusinessId) {
        data.business_id = currentBusinessId;
      }
      return await createBookingTemplate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingTemplates'] });
      // Also invalidate regular bookings as templates may be shown there
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Template created",
        description: "Booking template has been created successfully.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      console.error("Error creating template:", error);
      toast({
        title: "Failed to create template",
        description: error.message || "An error occurred while creating the template.",
        variant: "destructive",
      });
    },
  });

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: async ({ templateId, data }: { templateId: string; data: Partial<BookingTemplateFormData> }) => {
      return await updateBookingTemplate(templateId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingTemplates'] });
      // Also invalidate regular bookings as templates may be shown there
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Template updated",
        description: "Booking template has been updated successfully.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update template",
        description: error.message || "An error occurred while updating the template.",
        variant: "destructive",
      });
    },
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      return await deleteBookingTemplate(templateId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingTemplates'] });
      // Also invalidate regular bookings as templates may be shown there
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Template deleted",
        description: "Booking template has been deleted successfully.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete template",
        description: error.message || "An error occurred while deleting the template.",
        variant: "destructive",
      });
    },
  });

  // Publish template mutation
  const publishTemplateMutation = useMutation({
    mutationFn: async ({ templateId, isPublished }: { templateId: string; isPublished: boolean }) => {
      return await publishTemplate(templateId, isPublished);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingTemplates'] });
      // Also invalidate regular bookings as templates may be shown there
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Template status updated",
        description: "Booking template status has been updated successfully.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update template status",
        description: error.message || "An error occurred while updating the template status.",
        variant: "destructive",
      });
    },
  });

  // Template availability query hook
  const useTemplateAvailability = (templateId: string) => {
    return useQuery({
      queryKey: ['templateAvailability', templateId],
      queryFn: async () => {
        if (!templateId) return [];
        return await fetchTemplateAvailability(templateId);
      },
      enabled: !!templateId,
    });
  };

  // Template exceptions query hook
  const useTemplateExceptions = (templateId: string) => {
    return useQuery({
      queryKey: ['templateExceptions', templateId],
      queryFn: async () => {
        if (!templateId) return [];
        return await fetchTemplateExceptions(templateId);
      },
      enabled: !!templateId,
    });
  };

  // Add availability mutation
  const addAvailabilityMutation = useMutation({
    mutationFn: async (data: Omit<BookingTemplateAvailability, "id" | "created_at" | "updated_at">) => {
      return await addTemplateAvailability(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templateAvailability'] });
      toast({
        title: "Availability added",
        description: "Template availability has been added successfully.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add availability",
        description: error.message || "An error occurred while adding availability.",
        variant: "destructive",
      });
    },
  });

  // Delete availability mutation
  const deleteAvailabilityMutation = useMutation({
    mutationFn: async (availabilityId: string) => {
      return await deleteTemplateAvailability(availabilityId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templateAvailability'] });
      toast({
        title: "Availability deleted",
        description: "Template availability has been deleted successfully.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete availability",
        description: error.message || "An error occurred while deleting availability.",
        variant: "destructive",
      });
    },
  });

  // Add exception mutation
  const addExceptionMutation = useMutation({
    mutationFn: async (data: Omit<BookingTemplateException, "id" | "created_at" | "updated_at">) => {
      return await addTemplateException(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templateExceptions'] });
      toast({
        title: "Exception added",
        description: "Template exception has been added successfully.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add exception",
        description: error.message || "An error occurred while adding exception.",
        variant: "destructive",
      });
    },
  });

  // Delete exception mutation
  const deleteExceptionMutation = useMutation({
    mutationFn: async (exceptionId: string) => {
      return await deleteTemplateException(exceptionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templateExceptions'] });
      toast({
        title: "Exception deleted",
        description: "Template exception has been deleted successfully.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete exception",
        description: error.message || "An error occurred while deleting exception.",
        variant: "destructive",
      });
    },
  });

  return {
    // Query results
    templates: templatesQuery.data || [],
    filteredTemplates: filteredTemplates(),
    isLoading: templatesQuery.isLoading,
    error: templatesQuery.error,
    
    // Search and filter state
    searchQuery,
    setSearchQuery,
    filterPublished,
    setFilterPublished,
    
    // Template mutations
    createTemplate: createTemplateMutation.mutate,
    isCreating: createTemplateMutation.isPending,
    updateTemplate: updateTemplateMutation.mutate,
    isUpdating: updateTemplateMutation.isPending,
    deleteTemplate: deleteTemplateMutation.mutate,
    isDeleting: deleteTemplateMutation.isPending,
    publishTemplate: publishTemplateMutation.mutate,
    isPublishing: publishTemplateMutation.isPending,
    
    // Availability and exceptions hooks
    useTemplateAvailability,
    useTemplateExceptions,
    
    // Availability mutations
    addAvailability: addAvailabilityMutation.mutate,
    isAddingAvailability: addAvailabilityMutation.isPending,
    deleteAvailability: deleteAvailabilityMutation.mutate,
    isDeletingAvailability: deleteAvailabilityMutation.isPending,
    
    // Exception mutations
    addException: addExceptionMutation.mutate,
    isAddingException: addExceptionMutation.isPending,
    deleteException: deleteExceptionMutation.mutate,
    isDeletingException: deleteExceptionMutation.isPending,
  };
};
