
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ServiceFormFields } from './ServiceFormFields';

interface ServiceFormProps {
  serviceId?: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  serviceId,
  onSubmit,
  onCancel
}) => {
  const isEditMode = Boolean(serviceId);
  
  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{isEditMode ? 'Edit Service' : 'Create New Service'}</DialogTitle>
      </DialogHeader>
      
      <ServiceFormFields
        onSubmit={onSubmit}
        onCancel={onCancel}
        isEditMode={isEditMode}
        serviceId={serviceId}
      />
    </DialogContent>
  );
};
