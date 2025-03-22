
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CreateJobCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateJobCardDialog: React.FC<CreateJobCardDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Job Card</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <p className="text-center text-muted-foreground">
            Job card creation feature coming soon
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
