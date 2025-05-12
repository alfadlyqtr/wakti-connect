
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomization } from '../context';
import { ColorTab } from '../background-tabs/ColorTab';
import { ImageTab } from '../background-tabs/ImageTab';

export const BackgroundTabContent = () => {
  const { customization } = useCustomization();
  const activeTab = customization.background?.type === 'image' ? 'image' : 'color';

  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="color">Color</TabsTrigger>
        <TabsTrigger value="image">Image</TabsTrigger>
      </TabsList>
      
      <TabsContent value="color">
        <ColorTab />
      </TabsContent>
      
      <TabsContent value="image">
        <ImageTab />
      </TabsContent>
    </Tabs>
  );
};

export default BackgroundTabContent;
