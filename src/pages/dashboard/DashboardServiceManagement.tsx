
import React, { useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ServiceForm } from "@/components/services/ServiceForm";
import { ServiceList } from "@/components/services/ServiceList";

const DashboardServiceManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <DashboardShell>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Service Management</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <ServiceList />

      <ServiceForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
    </DashboardShell>
  );
};

export default DashboardServiceManagement;
