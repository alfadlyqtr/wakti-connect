
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export type ServiceFormData = {
  name: string;
  description: string;
  price: number;
  duration: number;
  status: 'active' | 'inactive';
};

export type Service = ServiceFormData & {
  id: string;
};

export const useServiceCrud = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [openAddService, setOpenAddService] = useState(false);
  
  const createService = async (data: ServiceFormData) => {
    setIsCreating(true);
    try {
      // Mock creating a service
      const mockService = {
        ...data,
        id: `service-${Date.now()}`
      };
      
      toast({
        title: "Service created",
        description: "Your service has been created successfully"
      });
      
      setIsCreating(false);
      return mockService;
    } catch (error: any) {
      toast({
        title: "Error creating service",
        description: error.message || "There was an error creating the service",
        variant: "destructive"
      });
      setIsCreating(false);
      throw error;
    }
  };
  
  const updateService = async (id: string, data: Partial<ServiceFormData>) => {
    setIsUpdating(true);
    try {
      // Mock updating a service
      const mockService = {
        ...data,
        id
      } as Service;
      
      toast({
        title: "Service updated",
        description: "Your service has been updated successfully"
      });
      
      setIsUpdating(false);
      return mockService;
    } catch (error: any) {
      toast({
        title: "Error updating service",
        description: error.message || "There was an error updating the service",
        variant: "destructive"
      });
      setIsUpdating(false);
      throw error;
    }
  };
  
  const deleteService = async (id: string) => {
    setIsDeleting(true);
    try {
      // Mock deleting a service
      toast({
        title: "Service deleted",
        description: "Your service has been deleted successfully"
      });
      
      setIsDeleting(false);
      return true;
    } catch (error: any) {
      toast({
        title: "Error deleting service",
        description: error.message || "There was an error deleting the service",
        variant: "destructive"
      });
      setIsDeleting(false);
      throw error;
    }
  };
  
  return {
    createService,
    updateService,
    deleteService,
    isCreating,
    isUpdating,
    isDeleting,
    editingService,
    setEditingService,
    openAddService,
    setOpenAddService
  };
};
