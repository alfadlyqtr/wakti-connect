
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ServiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId?: string;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  open,
  onOpenChange,
  serviceId,
}) => {
  const isEditing = !!serviceId;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Service Name</Label>
            <Input id="name" placeholder="Enter service name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter service description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" placeholder="0.00" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input id="duration" type="number" placeholder="60" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button>{isEditing ? 'Update' : 'Create'} Service</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
