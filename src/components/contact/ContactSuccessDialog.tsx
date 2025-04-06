
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ContactSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactSuccessDialog: React.FC<ContactSuccessDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { t } = useTranslation();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>{t("contact.messageSent")}</span>
          </DialogTitle>
          <DialogDescription>
            {t("contact.messageSent")}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button variant="default">OK</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSuccessDialog;
