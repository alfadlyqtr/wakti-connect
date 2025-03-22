
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface StaffDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffId?: string | null;
}

const StaffDetailsDialog = ({ open, onOpenChange, staffId }: StaffDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
