
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateSelector from "./TemplateSelector";
import CustomizationPanel from "./CustomizationPanel";
import InvitationPreview from "./InvitationPreview";
import { useInvitationBuilder } from "@/hooks/useInvitationBuilder";
import { InvitationCustomization } from "@/types/invitation.types";
import { Loader2 } from "lucide-react";

interface InvitationBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: any;
  onCustomizationCreated: (customizationId: string) => void;
}

const InvitationBuilderDialog: React.FC<InvitationBuilderDialogProps> = ({
  open,
  onOpenChange,
  appointment,
  onCustomizationCreated
}) => {
  const [activeTab, setActiveTab] = useState<string>("template");
  const {
    templates,
    isLoadingTemplates,
    selectedTemplateId,
    currentCustomization,
    selectTemplate,
    updateCustomization,
    resetToDefaults,
    createCustomization,
    getCurrentStyle
  } = useInvitationBuilder();
  
  const handleNext = () => {
    if (activeTab === "template" && selectedTemplateId) {
      setActiveTab("customize");
    } else if (activeTab === "customize") {
      setActiveTab("preview");
    }
  };
  
  const handleBack = () => {
    if (activeTab === "customize") {
      setActiveTab("template");
    } else if (activeTab === "preview") {
      setActiveTab("customize");
    }
  };
  
  const handleSaveCustomization = async () => {
    try {
      const result = await createCustomization.mutateAsync();
      if (result) {
        onCustomizationCreated(result.id);
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error saving customization:", error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Design Your Invitation</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="template">1. Template</TabsTrigger>
            <TabsTrigger value="customize" disabled={!selectedTemplateId}>2. Customize</TabsTrigger>
            <TabsTrigger value="preview" disabled={!selectedTemplateId}>3. Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="template">
            <TemplateSelector
              templates={templates}
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={selectTemplate}
              isLoading={isLoadingTemplates}
            />
          </TabsContent>
          
          <TabsContent value="customize">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CustomizationPanel
                customization={currentCustomization}
                onChange={updateCustomization}
                onReset={resetToDefaults}
              />
              
              <div className="hidden md:block">
                <InvitationPreview
                  style={getCurrentStyle()}
                  appointment={appointment}
                  headerImage={currentCustomization.headerImage}
                  mapLocation={currentCustomization.mapLocation}
                  layoutSize={currentCustomization.layoutSize}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="flex justify-center">
              <div className="max-w-md">
                <InvitationPreview
                  style={getCurrentStyle()}
                  appointment={appointment}
                  headerImage={currentCustomization.headerImage}
                  mapLocation={currentCustomization.mapLocation}
                  layoutSize={currentCustomization.layoutSize}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex items-center justify-between pt-4 flex-row">
          <div>
            {activeTab !== "template" && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            
            {activeTab === "preview" ? (
              <Button 
                type="button" 
                onClick={handleSaveCustomization}
                disabled={createCustomization.isPending}
              >
                {createCustomization.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save & Continue"
                )}
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={handleNext}
                disabled={activeTab === "template" && !selectedTemplateId}
              >
                Next
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationBuilderDialog;
