
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import SectionTemplateSelector from "../SectionTemplateSelector";
import { SectionType } from "@/types/business.types";

interface SectionTemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sectionType: SectionType;
  onSelect: (templateContent: any) => void;
}

const SectionTemplateDialog: React.FC<SectionTemplateDialogProps> = ({
  isOpen,
  onOpenChange,
  sectionType,
  onSelect
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Template</DialogTitle>
        </DialogHeader>
        <SectionTemplateSelector 
          sectionType={sectionType}
          onSelect={onSelect}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SectionTemplateDialog;
