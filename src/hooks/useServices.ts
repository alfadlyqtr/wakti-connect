
import { useState } from 'react';
import { Service, ServiceFormValues } from "@/types/service.types";
import { useServiceCrud } from './useServiceCrud';

export const useServices = () => {
  const {
    services,
    isLoading,
    error,
    openAddService,
    setOpenAddService,
    editingService,
    setEditingService,
    addServiceMutation,
    updateServiceMutation,
    deleteServiceMutation
  } = useServiceCrud();

  // Get staff assignments count by service
  const staffAssignments = services?.reduce((acc, service) => {
    acc[service.id] = service.assigned_staff?.length || 0;
    return acc;
  }, {} as Record<string, number>) || {};

  const handleSubmit = (values: ServiceFormValues) => {
    if (editingService) {
      updateServiceMutation.mutate({ id: editingService.id, formData: values });
    } else {
      addServiceMutation.mutate(values);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setOpenAddService(true);
  };

  const handleDeleteService = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteServiceMutation.mutate(id);
    }
  };

  return {
    services,
    isLoading,
    error,
    openAddService,
    setOpenAddService,
    editingService,
    setEditingService,
    handleSubmit,
    handleEditService,
    handleDeleteService,
    isPendingAdd: addServiceMutation.isPending,
    isPendingUpdate: updateServiceMutation.isPending,
    isPendingDelete: deleteServiceMutation.isPending,
    staffAssignments
  };
};
