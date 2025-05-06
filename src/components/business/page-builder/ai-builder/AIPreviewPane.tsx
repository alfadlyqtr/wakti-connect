
import React from "react";
import { BusinessPage, BusinessPageSection } from "@/types/business.types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Smartphone, Tablet, Monitor } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AIPreviewPaneProps {
  sections: BusinessPageSection[];
  businessPage: BusinessPage;
}

const AIPreviewPane: React.FC<AIPreviewPaneProps> = ({ sections, businessPage }) => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="desktop" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-xs mx-auto">
          <TabsTrigger value="desktop" className="flex items-center gap-1">
            <Monitor className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Desktop</span>
          </TabsTrigger>
          <TabsTrigger value="tablet" className="flex items-center gap-1">
            <Tablet className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Tablet</span>
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-1">
            <Smartphone className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Mobile</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="desktop" className="mt-4">
          <PreviewFrame sections={sections} businessPage={businessPage} width="100%" />
        </TabsContent>
        
        <TabsContent value="tablet" className="mt-4">
          <div className="flex justify-center">
            <PreviewFrame sections={sections} businessPage={businessPage} width="768px" />
          </div>
        </TabsContent>
        
        <TabsContent value="mobile" className="mt-4">
          <div className="flex justify-center">
            <PreviewFrame sections={sections} businessPage={businessPage} width="375px" />
          </div>
        </TabsContent>
      </Tabs>
      
      <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle>Preview Mode</AlertTitle>
        <AlertDescription>
          This is a preview of how your page will look. Apply these changes to see them on your actual page.
        </AlertDescription>
      </Alert>
    </div>
  );
};

const PreviewFrame: React.FC<{
  sections: BusinessPageSection[];
  businessPage: BusinessPage;
  width: string;
}> = ({ sections, businessPage, width }) => {
  return (
    <Card className="overflow-hidden" style={{ width }}>
      <CardContent className="p-0">
        <div className="bg-background border rounded-md overflow-hidden min-h-[400px] max-h-[600px] overflow-y-auto">
          {/* For now we'll just render a placeholder representation of each section */}
          {sections.map((section, index) => (
            <div key={index} className="border-b last:border-b-0 p-4">
              <div className="font-medium capitalize">{section.section_type} Section</div>
              <div className="text-sm text-muted-foreground mt-1">
                {section.section_content?.title || `${section.section_type} content`}
              </div>
            </div>
          ))}
          
          {sections.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
              <p className="text-muted-foreground">No content generated yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIPreviewPane;
