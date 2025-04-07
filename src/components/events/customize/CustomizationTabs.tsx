
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BackgroundTabContent,
  TextTabContent,
  ButtonsTabContent,
  HeaderTabContent,
  FeaturesTabContent,
  CardEffectTabContent,
  AnimationsTabContent
} from "./tabs-content";
import { useTranslation } from "react-i18next";

interface CustomizationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CustomizationTabs: React.FC<CustomizationTabsProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  const { t } = useTranslation();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="flex flex-wrap w-full mb-4 overflow-x-auto">
        <TabsTrigger value="background" className="px-2.5 py-1.5 text-xs sm:text-sm">{t("events.background")}</TabsTrigger>
        <TabsTrigger value="text" className="px-2.5 py-1.5 text-xs sm:text-sm">{t("events.text")}</TabsTrigger>
        <TabsTrigger value="buttons" className="px-2.5 py-1.5 text-xs sm:text-sm">{t("events.buttons")}</TabsTrigger>
        <TabsTrigger value="header" className="px-2.5 py-1.5 text-xs sm:text-sm">{t("events.header")}</TabsTrigger>
        <TabsTrigger value="features" className="px-2.5 py-1.5 text-xs sm:text-sm">{t("events.features")}</TabsTrigger>
        <TabsTrigger value="effects" className="px-2.5 py-1.5 text-xs sm:text-sm">{t("events.cardEffect")}</TabsTrigger>
        <TabsTrigger value="animations" className="px-2.5 py-1.5 text-xs sm:text-sm">{t("events.animations")}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="background" className="space-y-4">
        <BackgroundTabContent />
      </TabsContent>
      
      <TabsContent value="text" className="space-y-4">
        <TextTabContent />
      </TabsContent>
      
      <TabsContent value="buttons" className="space-y-4">
        <ButtonsTabContent />
      </TabsContent>
      
      <TabsContent value="header" className="space-y-6">
        <HeaderTabContent />
      </TabsContent>
      
      <TabsContent value="features" className="space-y-6">
        <FeaturesTabContent />
      </TabsContent>
      
      <TabsContent value="effects" className="space-y-6">
        <CardEffectTabContent />
      </TabsContent>
      
      <TabsContent value="animations" className="space-y-6">
        <AnimationsTabContent />
      </TabsContent>

      <TabsContent value="more" className="space-y-6 sm:hidden">
        <Tabs defaultValue="features">
          <TabsList className="grid grid-cols-3 mb-4 w-full">
            <TabsTrigger value="features">{t("events.features")}</TabsTrigger>
            <TabsTrigger value="effects">{t("events.cardEffect")}</TabsTrigger>
            <TabsTrigger value="animations">{t("events.animations")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="features" className="space-y-6">
            <FeaturesTabContent />
          </TabsContent>
          
          <TabsContent value="effects" className="space-y-6">
            <CardEffectTabContent />
          </TabsContent>
          
          <TabsContent value="animations" className="space-y-6">
            <AnimationsTabContent />
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
};

export default CustomizationTabs;
