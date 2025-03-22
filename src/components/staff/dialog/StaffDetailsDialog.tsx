
// Replace with a stub implementation since we're removing staff functionality
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface StaffDetailsDialogProps {
  open: boolean;
  onClose: () => void;
}

const StaffDetailsDialog = ({ open, onClose }: StaffDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Staff Management Removed</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground">
            Staff management functionality has been removed from this version.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDetailsDialog;
