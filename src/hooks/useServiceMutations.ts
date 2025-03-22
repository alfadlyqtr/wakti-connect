
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Service } from './useServiceQueries';

export interface ServiceFormData {
  name: string;
  description: string;
  price: number;
  duration: number;
  status: 'active' | 'inactive';
}

export const useServiceMutations = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const createService = async (data: ServiceFormData) => {
    setIsCreating(true);
    try {
      // Mock create
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: "Service created",
        description: `${data.name} has been created successfully.`,
      });
      return { id: Math.random().toString(), ...data };
    } catch (error) {
      toast({
        title: "Failed to create service",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateService = async (id: string, data: ServiceFormData) => {
    setIsUpdating(true);
    try {
      // Mock update
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: "Service updated",
        description: `${data.name} has been updated successfully.`,
      });
      return { id, ...data };
    } catch (error) {
      toast({
        title: "Failed to update service",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteService = async (id: string) => {
    setIsDeleting(true);
    try {
      // Mock delete
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: "Service deleted",
        description: "The service has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to delete service",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    createService,
    updateService,
    deleteService,
    isCreating,
    isUpdating,
    isDeleting
  };
};
