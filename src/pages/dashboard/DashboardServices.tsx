
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { ServiceList } from "@/components/services/ServiceList";
import { ServiceForm } from "@/components/services/ServiceForm";
import { Dialog } from "@/components/ui/dialog";
import { useServiceQueries } from "@/hooks/useServiceQueries";
import { useServiceMutations } from "@/hooks/useServiceMutations";

const DashboardServices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const { services, isLoading, error } = useServiceQueries();
  const { createService, updateService, deleteService } = useServiceMutations();

  const filteredServices = services?.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditService = (id: string) => {
    setSelectedServiceId(id);
    setIsEditDialogOpen(true);
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      await deleteService(id);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Manage the services you offer to your customers
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ServiceList
        services={filteredServices || []}
        isLoading={isLoading}
        onEdit={handleEditService}
        onDelete={handleDeleteService}
        error={error}
      />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <ServiceForm
          onSubmit={async (data) => {
            await createService(data);
            setIsCreateDialogOpen(false);
          }}
          onCancel={() => setIsCreateDialogOpen(false)}
        />
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {selectedServiceId && (
          <ServiceForm
            serviceId={selectedServiceId}
            onSubmit={async (data) => {
              await updateService(selectedServiceId, data);
              setIsEditDialogOpen(false);
            }}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        )}
      </Dialog>
    </div>
  );
};

export default DashboardServices;
