
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomization } from '../context';
import ColorTab from '../background-tabs/ColorTab';
import ImageTab from '../background-tabs/ImageTab';

interface BackgroundTabContentProps {
  title?: string;
  description?: string;
}

export const BackgroundTabContent: React.FC<BackgroundTabContentProps> = ({ title, description }) => {
  const { customization } = useCustomization();
  const activeTab = customization.background?.type === 'image' ? 'image' : 'color';

  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="color">Color</TabsTrigger>
        <TabsTrigger value="image">Image</TabsTrigger>
      </TabsList>
      
      <TabsContent value="color">
        <ColorTab value={customization.background?.value || '#ffffff'} onChange={(value) => {
          const { handleBackgroundChange } = useCustomization();
          handleBackgroundChange('color', value);
        }} />
      </TabsContent>
      
      <TabsContent value="image">
        <ImageTab 
          value={customization.background?.value || ''} 
          onChange={(value) => {
            const { handleBackgroundChange } = useCustomization();
            handleBackgroundChange('image', value);
          }}
          title={title}
          description={description}
        />
      </TabsContent>
    </Tabs>
  );
};

export default BackgroundTabContent;
