
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, Copy, Loader2 } from "lucide-react";
import { SectionType } from "@/types/business.types";
import { getTemplates } from "@/data/section-templates";
import { useSectionEditor } from "./SectionEditorContext";
import { toast } from "@/components/ui/use-toast";

interface SectionTemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  sectionType: SectionType;
  onSelect: (templateContent: any) => void;
}

const SectionTemplateDialog: React.FC<SectionTemplateDialogProps> = ({
  isOpen,
  onOpenChange,
  sectionType,
  onSelect
}) => {
  const templates = getTemplates(sectionType);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const { applyTemplateContent } = useSectionEditor();
  
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };
  
  const handleApplyTemplate = () => {
    if (!selectedTemplate) return;
    
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return;
    
    try {
      console.log("Applying template:", template);
      setIsApplying(true);
      
      // Validate template content
      if (!template.content || typeof template.content !== 'object') {
        console.error("Invalid template content:", template.content);
        toast({
          variant: "destructive",
          title: "Invalid template",
          description: "This template has invalid content and cannot be applied."
        });
        setIsApplying(false);
        return;
      }
      
      // Apply template content
      applyTemplateContent(template.content);
      onSelect(template.content);
      
      setTimeout(() => {
        setIsApplying(false);
        onOpenChange(false);
        
        toast({
          title: "Template applied",
          description: "The template has been applied to your section."
        });
      }, 500);
    } catch (error) {
      console.error('Error applying template:', error);
      setIsApplying(false);
      toast({
        variant: "destructive",
        title: "Failed to apply template",
        description: "An error occurred while applying the template."
      });
    }
  };
  
  const groupedTemplates = templates.reduce((groups: Record<string, any[]>, template) => {
    const category = template.category || 'General';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(template);
    return groups;
  }, {});
  
  const categories = Object.keys(groupedTemplates);
  
  if (templates.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Templates Available</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <p>There are no templates available for this section type.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
        </DialogHeader>
        
        {categories.length > 1 ? (
          <Tabs defaultValue={categories[0]}>
            <TabsList className="mb-4">
              {categories.map(category => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map(category => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedTemplates[category].map(template => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      isSelected={selectedTemplate === template.id}
                      onSelect={handleSelectTemplate}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onSelect={handleSelectTemplate}
              />
            ))}
          </div>
        )}
        
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            disabled={!selectedTemplate || isApplying} 
            onClick={handleApplyTemplate}
          >
            {isApplying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying Template...
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Apply Template
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface TemplateCardProps {
  template: any;
  isSelected: boolean;
  onSelect: (templateId: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  isSelected, 
  onSelect 
}) => {
  return (
    <div 
      className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'hover:border-primary/50'
      }`}
      onClick={() => onSelect(template.id)}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{template.name}</h3>
          {isSelected && (
            <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </div>
      
      {template.previewUrl && (
        <div className="mt-4 rounded-md overflow-hidden border">
          <img 
            src={template.previewUrl} 
            alt={`Preview of ${template.name}`}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default SectionTemplateDialog;
