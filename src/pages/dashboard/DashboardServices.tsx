import React, { useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";

const DashboardServices = () => {
  const [isViewMode, setIsViewMode] = useState(true);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
      </div>
      
      {isViewMode && (
        <>
          <ServiceList />
          
          <Button onClick={() => {
            setIsViewMode(false);
            setIsCreateMode(true);
          }}>Create Service</Button>
        </>
      )}
      
      {isCreateMode && (
        <div className="mt-6">
          <ServiceForm />
        </div>
      )}
      
      {isEditMode && (
        <div className="mt-6">
          <ServiceForm/>
        </div>
      )}
      
    </DashboardShell>
  );
};

export default DashboardServices;
