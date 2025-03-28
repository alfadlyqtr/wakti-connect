
import { useState } from 'react';
import { Service, ServiceFormValues } from "@/types/service.types";
import { useServiceCrud } from './useServiceCrud';

// A simplified hook with business logic
export const useServices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const {
    services,
    isLoading,
    error,
    refetch,
    openAddService,
    setOpenAddService,
    editingService,
    setEditingService,
    addServiceMutation,
    updateServiceMutation,
    deleteServiceMutation
  } = useServiceCrud();

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
    deleteServiceMutation.mutate(id);
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

  // Filter services based on search query
  const filteredServices = searchQuery && services 
    ? services.filter(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : services;

  return {
    services: filteredServices,
    isLoading,
    error,
    refetch,
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
    searchQuery,
    setSearchQuery,
    serviceToDelete,
    setServiceToDelete,
    deleteDialogOpen,
    setDeleteDialogOpen
  };
};
