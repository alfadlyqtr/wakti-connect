
import React from 'react';
import { useCustomization } from '../context';
import { Label } from '@/components/ui/label';
import FontSelector from '../FontSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TextTabContent: React.FC = () => {
  const { customization, handleFontChange, handleHeaderFontChange, handleDescriptionFontChange, handleDateTimeFontChange } = useCustomization();
  
  const [activeTab, setActiveTab] = React.useState('main');

  return (
    <div className="space-y-4">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="main">Main</TabsTrigger>
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="datetime">Date & Time</TabsTrigger>
        </TabsList>
        
        <TabsContent value="main" className="space-y-4">
          <FontSelector 
            font={customization.font || { 
              family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              size: 'medium',
              color: '#333333'
            }}
            onFontChange={handleFontChange}
            showAlignment={true}
            showWeight={true}
            previewText="This is how your main text will look"
          />
        </TabsContent>
        
        <TabsContent value="header" className="space-y-4">
          {customization.headerFont ? (
            <FontSelector 
              font={customization.headerFont}
              onFontChange={handleHeaderFontChange}
              showWeight={true}
              previewText="Event Title Example"
            />
          ) : (
            <div className="flex justify-center items-center p-6">
              <Label className="text-muted-foreground">
                Customize header font to override default settings
              </Label>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="description" className="space-y-4">
          {customization.descriptionFont ? (
            <FontSelector 
              font={customization.descriptionFont}
              onFontChange={handleDescriptionFontChange}
              showWeight={true}
              previewText="This is an example of how your event description will look to your guests."
            />
          ) : (
            <div className="flex justify-center items-center p-6">
              <Label className="text-muted-foreground">
                Customize description font to override default settings
              </Label>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="datetime" className="space-y-4">
          {customization.dateTimeFont ? (
            <FontSelector 
              font={customization.dateTimeFont}
              onFontChange={handleDateTimeFontChange}
              showWeight={true}
              previewText="May 15, 2023 • 3:00 PM"
            />
          ) : (
            <div className="flex justify-center items-center p-6">
              <Label className="text-muted-foreground">
                Customize date & time font to override default settings
              </Label>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TextTabContent;
