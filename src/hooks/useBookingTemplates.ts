
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { 
  BookingTemplate, 
  BookingTemplateFormData, 
  BookingTemplateWithRelations,
  BookingTemplateAvailability,
  BookingTemplateException
} from '@/types/booking.types';
import {
  fetchTemplateAvailability,
  addTemplateAvailability,
  deleteTemplateAvailability,
  fetchTemplateExceptions,
  addTemplateException,
  deleteTemplateException
} from '@/services/booking/templates';

/**
 * Enhanced hook to manage booking templates with filter and CRUD operations
 */
export const useBookingTemplates = (businessId?: string) => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPublished, setFilterPublished] = useState<boolean | null>(null);

  // Fetch templates
  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ['booking-templates', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await supabase
        .from('booking_templates')
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
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as BookingTemplateWithRelations[];
    },
    enabled: !!businessId
  });
  
  // Filter templates based on search query and published filter
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPublishedFilter = filterPublished === null || template.is_published === filterPublished;
    
    return matchesSearch && matchesPublishedFilter;
  });

  // Create template mutation
  const createTemplate = useMutation({
    mutationFn: async (data: BookingTemplateFormData) => {
      const { data: template, error } = await supabase
        .from('booking_templates')
        .insert(data)
        .select()
        .single();
        
      if (error) throw error;
      return template;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-templates'] });
      toast({ 
        title: "Template created", 
        description: "Booking template created successfully." 
      });
    },
    onError: (error) => {
      toast({ 
        variant: "destructive", 
        title: "Error creating template", 
        description: error.message 
      });
    }
  });

  // Update template mutation
  const updateTemplate = useMutation({
    mutationFn: async ({ templateId, data }: { templateId: string, data: Partial<BookingTemplateFormData> }) => {
      const { data: template, error } = await supabase
        .from('booking_templates')
        .update(data)
        .eq('id', templateId)
        .select()
        .single();
        
      if (error) throw error;
      return template;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-templates'] });
      toast({ 
        title: "Template updated", 
        description: "Booking template updated successfully." 
      });
    },
    onError: (error) => {
      toast({ 
        variant: "destructive", 
        title: "Error updating template", 
        description: error.message 
      });
    }
  });

  // Delete template mutation
  const deleteTemplate = useMutation({
    mutationFn: async (templateId: string) => {
      const { error } = await supabase
        .from('booking_templates')
        .delete()
        .eq('id', templateId);
        
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-templates'] });
      toast({ 
        title: "Template deleted", 
        description: "Booking template deleted successfully." 
      });
    },
    onError: (error) => {
      toast({ 
        variant: "destructive", 
        title: "Error deleting template", 
        description: error.message 
      });
    }
  });

  // Publish/unpublish template mutation
  const publishTemplate = useMutation({
    mutationFn: async ({ templateId, isPublished }: { templateId: string, isPublished: boolean }) => {
      const { data: template, error } = await supabase
        .from('booking_templates')
        .update({ is_published: isPublished })
        .eq('id', templateId)
        .select()
        .single();
        
      if (error) throw error;
      return template;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['booking-templates'] });
      toast({ 
        title: variables.isPublished ? "Template published" : "Template unpublished", 
        description: `Template is now ${variables.isPublished ? "visible" : "hidden"} on your business page.` 
      });
    },
    onError: (error) => {
      toast({ 
        variant: "destructive", 
        title: "Error updating template", 
        description: error.message 
      });
    }
  });

  // Hook to fetch availability for a template
  const useTemplateAvailability = (templateId: string) => {
    return useQuery({
      queryKey: ['template-availability', templateId],
      queryFn: () => fetchTemplateAvailability(templateId),
      enabled: !!templateId
    });
  };

  // Hook to fetch exceptions for a template
  const useTemplateExceptions = (templateId: string) => {
    return useQuery({
      queryKey: ['template-exceptions', templateId],
      queryFn: () => fetchTemplateExceptions(templateId),
      enabled: !!templateId
    });
  };

  // Add availability mutation
  const addAvailability = useMutation({
    mutationFn: (availabilityData: Omit<BookingTemplateAvailability, 'id' | 'created_at' | 'updated_at'>) => 
      addTemplateAvailability(availabilityData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template-availability'] });
      toast({ 
        title: "Availability added", 
        description: "Template availability has been added." 
      });
    },
    onError: (error) => {
      toast({ 
        variant: "destructive", 
        title: "Error adding availability", 
        description: error.message 
      });
    }
  });

  // Delete availability mutation
  const deleteAvailability = useMutation({
    mutationFn: (availabilityId: string) => deleteTemplateAvailability(availabilityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template-availability'] });
      toast({ 
        title: "Availability removed", 
        description: "Template availability has been removed." 
      });
    },
    onError: (error) => {
      toast({ 
        variant: "destructive", 
        title: "Error removing availability", 
        description: error.message 
      });
    }
  });

  // Add exception mutation
  const addException = useMutation({
    mutationFn: (exceptionData: Omit<BookingTemplateException, 'id' | 'created_at' | 'updated_at'>) => 
      addTemplateException(exceptionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template-exceptions'] });
      toast({ 
        title: "Exception added", 
        description: "Template exception has been added." 
      });
    },
    onError: (error) => {
      toast({ 
        variant: "destructive", 
        title: "Error adding exception", 
        description: error.message 
      });
    }
  });

  // Delete exception mutation
  const deleteException = useMutation({
    mutationFn: (exceptionId: string) => deleteTemplateException(exceptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template-exceptions'] });
      toast({ 
        title: "Exception removed", 
        description: "Template exception has been removed." 
      });
    },
    onError: (error) => {
      toast({ 
        variant: "destructive", 
        title: "Error removing exception", 
        description: error.message 
      });
    }
  });

  return {
    templates,
    filteredTemplates,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filterPublished,
    setFilterPublished,
    createTemplate,
    isCreating: createTemplate.isPending,
    updateTemplate,
    isUpdating: updateTemplate.isPending,
    deleteTemplate,
    isDeleting: deleteTemplate.isPending,
    publishTemplate,
    isPublishing: publishTemplate.isPending,
    useTemplateAvailability,
    useTemplateExceptions,
    addAvailability,
    isAddingAvailability: addAvailability.isPending,
    deleteAvailability,
    isDeletingAvailability: deleteAvailability.isPending,
    addException,
    isAddingException: addException.isPending,
    deleteException,
    isDeletingException: deleteException.isPending
  };
};
