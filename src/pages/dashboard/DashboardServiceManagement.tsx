
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ServiceForm } from '@/components/services/ServiceForm';
import { ServiceList } from '@/components/services/ServiceList';
import { useServiceCrud } from '@/hooks/useServiceCrud';

export default function DashboardServiceManagement() {
  const [openServiceForm, setOpenServiceForm] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | undefined>(undefined);
  const serviceCrud = useServiceCrud();

  const handleEdit = (serviceId: string) => {
    setEditingServiceId(serviceId);
    setOpenServiceForm(true);
  };

  const handleSubmit = async (data: any) => {
    if (editingServiceId) {
      await serviceCrud.updateService(editingServiceId, data);
    } else {
      await serviceCrud.createService(data);
    }
    setOpenServiceForm(false);
    setEditingServiceId(undefined);
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Service Management"
        description="Manage the services you offer to your clients"
      >
        <Button onClick={() => setOpenServiceForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </DashboardHeader>
      
      {openServiceForm && (
        <ServiceForm
          serviceId={editingServiceId}
          onSubmit={handleSubmit}
          onCancel={() => {
            setOpenServiceForm(false);
            setEditingServiceId(undefined);
          }}
        />
      )}
      
      <ServiceList onEditService={handleEdit} />
    </DashboardShell>
  );
}
