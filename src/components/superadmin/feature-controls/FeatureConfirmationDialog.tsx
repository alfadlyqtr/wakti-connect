
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Lock, Unlock } from "lucide-react";

interface FeatureConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  feature: string;
  actionType: "lock" | "unlock";
}

export const FeatureConfirmationDialog: React.FC<FeatureConfirmationDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  feature,
  actionType,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-left">
            <div className={`p-2 rounded-full ${
              actionType === "lock" ? "bg-red-100" : "bg-green-100"
            }`}>
              {actionType === "lock" ? (
                <Lock className="h-5 w-5 text-red-600" />
              ) : (
                <Unlock className="h-5 w-5 text-green-600" />
              )}
            </div>
            <DialogTitle className="text-xl">
              {actionType === "lock" ? "Lock" : "Unlock"} Feature
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            {actionType === "lock"
              ? `Are you sure you want to lock access to ${feature}? This action will prevent users from accessing this feature.`
              : `Are you sure you want to unlock access to ${feature}? This action will restore user access to this feature.`}
          </DialogDescription>
        </DialogHeader>
        {actionType === "lock" && (
          <div className="bg-red-900/20 border border-red-800 rounded-md p-3 my-2">
            <div className="flex gap-2 items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">
                Locking a feature will immediately disable access for all users. 
                This may interrupt ongoing work. Use with caution.
              </p>
            </div>
          </div>
        )}
        <DialogFooter className="sm:justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-700 hover:bg-gray-800 text-gray-300"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className={`${
              actionType === "lock" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {actionType === "lock" ? (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Proceed to Lock
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                Proceed to Unlock
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
