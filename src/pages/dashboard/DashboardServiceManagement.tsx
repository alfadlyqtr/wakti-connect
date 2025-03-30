
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import ServiceForm from "@/components/services/ServiceForm";
import ServiceList from "@/components/services/ServiceList";
import { useServices } from "@/hooks/useServices";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardServiceManagement = () => {
  const isMobile = useIsMobile();
  
  const { 
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
    isPendingAdd,
    isPendingUpdate,
    isPendingDelete,
    searchQuery,
    setSearchQuery,
    serviceToDelete,
    setServiceToDelete,
    deleteDialogOpen,
    setDeleteDialogOpen,
    refetch
  } = useServices();

  const handleCancelDialog = () => {
    setOpenAddService(false);
    setEditingService(null);
  };

  const handleDeleteClick = (service: any) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      handleDeleteService(serviceToDelete.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Service Management</h1>
          <p className="text-muted-foreground text-sm md:text-base">Create and manage your business services.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={openAddService} onOpenChange={setOpenAddService}>
            <DialogTrigger asChild>
              <Button className={isMobile ? "flex-1 h-10" : ""}>
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className={isMobile ? "w-[95vw] max-w-md p-4 rounded-lg" : ""}>
              <ServiceForm 
                onSubmit={handleSubmit}
                onCancel={handleCancelDialog}
                editingService={editingService}
                isPending={isPendingAdd || isPendingUpdate}
              />
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => refetch()} className={isMobile ? "flex-1 h-10" : ""}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search services..." 
            className="pl-10 h-12 md:h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ServiceList 
        services={services}
        isLoading={isLoading}
        error={error}
        onAddService={() => setOpenAddService(true)}
        onEditService={handleEditService}
        onDeleteService={handleDeleteClick}
        isDeleting={isPendingDelete}
      />

      <ConfirmationDialog
        title="Delete Service"
        description={`Are you sure you want to delete "${serviceToDelete?.name}"? This action cannot be undone.`}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={isPendingDelete}
      />
    </div>
  );
};

export default DashboardServiceManagement;
