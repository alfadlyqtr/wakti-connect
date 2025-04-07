
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
  onOpenChange,
}) => {
  const { t } = useTranslation();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <DialogTitle className="text-center">{t("contactInfo.messageSentTitle")}</DialogTitle>
          <DialogDescription className="text-center">
            {t("contactInfo.messageSentDesc")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button onClick={() => onOpenChange(false)}>{t("common.close")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSuccessDialog;
