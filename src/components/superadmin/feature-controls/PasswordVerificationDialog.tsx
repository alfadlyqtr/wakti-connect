
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Key, ShieldAlert } from "lucide-react";

interface PasswordVerificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (password: string) => void;
  feature: string;
  actionType: "lock" | "unlock";
  isLoading: boolean;
}

export const PasswordVerificationDialog: React.FC<PasswordVerificationDialogProps> = ({
  isOpen,
  onOpenChange,
  onVerify,
  feature,
  actionType,
  isLoading
}) => {
  const [password, setPassword] = useState("");

  const handleVerify = () => {
    onVerify(password);
    setPassword("");
  };

  const handleClose = () => {
    setPassword("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-left mb-2">
            <div className="p-2 rounded-full bg-amber-100">
              <ShieldAlert className="h-6 w-6 text-amber-600" />
            </div>
            <DialogTitle className="text-xl">
              Master Password Required
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            {actionType === "lock" 
              ? "Enter the master password to lock access to" 
              : "Enter the master password to restore access to"} <span className="font-semibold text-white">{feature}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Key className="h-4 w-4" />
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter master password"
                className="pl-10 bg-gray-800 border-gray-700 text-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && password) {
                    handleVerify();
                  }
                }}
              />
            </div>
            <p className="text-xs text-gray-500">
              <Lock className="h-3 w-3 inline mr-1" />
              This action requires verification to protect system security
            </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-gray-700 hover:bg-gray-800 text-gray-300"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!password || isLoading}
            onClick={handleVerify}
            className={`${
              actionType === "lock" ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isLoading ? (
              <>Processing...</>
            ) : (
              <>
                <ShieldAlert className="h-4 w-4 mr-2" />
                {actionType === "lock" ? "Lock Feature" : "Unlock Feature"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
