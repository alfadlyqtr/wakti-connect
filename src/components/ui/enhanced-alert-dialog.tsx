
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

type AlertVariant = "default" | "destructive" | "success" | "info";

interface EnhancedAlertDialogProps {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: AlertVariant;
  showCancel?: boolean;
}

export const EnhancedAlertDialog: React.FC<EnhancedAlertDialogProps> = ({
  title,
  description,
  open,
  onOpenChange,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  showCancel = true,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const getIconAndColors = () => {
    switch (variant) {
      case "destructive":
        return { 
          icon: <XCircle className="h-6 w-6 text-red-600" />,
          bgColor: "bg-red-100",
          buttonVariant: "destructive" as const
        };
      case "success":
        return { 
          icon: <CheckCircle className="h-6 w-6 text-green-600" />,
          bgColor: "bg-green-100",
          buttonVariant: "success" as const
        };
      case "info":
        return { 
          icon: <Info className="h-6 w-6 text-blue-600" />,
          bgColor: "bg-blue-100",
          buttonVariant: "default" as const
        };
      default:
        return { 
          icon: <AlertCircle className="h-6 w-6 text-amber-600" />,
          bgColor: "bg-amber-100",
          buttonVariant: "default" as const
        };
    }
  };
  
  const { icon, bgColor, buttonVariant } = getIconAndColors();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-lg">
        <AlertDialogHeader className="gap-4">
          <div className="flex items-start gap-4">
            <div className={`${bgColor} p-3 rounded-full shrink-0`}>
              {icon}
            </div>
            <div className="text-left">
              <AlertDialogTitle className="text-xl font-semibold">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2 text-base">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-3 mt-6">
          {showCancel && (
            <AlertDialogCancel asChild>
              <Button variant="outline" className="w-full">
                {cancelLabel}
              </Button>
            </AlertDialogCancel>
          )}
          <AlertDialogAction asChild>
            <Button 
              variant={buttonVariant} 
              onClick={handleConfirm}
              className="w-full"
            >
              {confirmLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
