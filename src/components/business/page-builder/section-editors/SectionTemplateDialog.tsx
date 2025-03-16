
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SectionType } from "@/types/business.types";
import { useSectionTemplates } from "@/hooks/useSectionTemplates";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  const { templates, isLoading } = useSectionTemplates(sectionType);

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Section Templates</DialogTitle>
            <DialogDescription>
              No templates available for this section type.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-muted-foreground">
              Try creating your own template or use the default settings.
            </p>
            <Button 
              className="mt-4" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Select a template to quickly set up your {sectionType} section
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {templates.map(template => (
            <Card 
              key={template.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => onSelect(template.template_content)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{template.template_name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.is_system ? "System Template" : "Custom Template"}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(template.template_content);
                    }}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SectionTemplateDialog;
