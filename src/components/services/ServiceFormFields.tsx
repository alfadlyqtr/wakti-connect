
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface ServiceFormFieldsProps {
  serviceId?: string;
  isEditMode: boolean;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const ServiceFormFields: React.FC<ServiceFormFieldsProps> = ({
  serviceId,
  isEditMode,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="py-4">
      <p className="text-center text-muted-foreground mb-6">
        Service form fields will be implemented in a future update
      </p>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => onSubmit({
            name: 'Sample Service',
            description: 'Service description',
            price: 99.99,
            duration: 60,
            status: 'active'
          })}
        >
          {isEditMode ? 'Update Service' : 'Create Service'}
        </Button>
      </DialogFooter>
    </div>
  );
};
