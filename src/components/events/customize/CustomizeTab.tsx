
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCustomization } from '@/types/event.types';
import { Button } from '@/components/ui/button';
import BackgroundTabContent from './tabs-content/BackgroundTabContent';
import TextTabContent from './tabs-content/TextTabContent';
import ButtonsTabContent from './tabs-content/ButtonsTabContent';
import HeaderTabContent from './tabs-content/HeaderTabContent';
import AnimationsTabContent from './tabs-content/AnimationsTabContent';
import CardEffectTabContent from './tabs-content/CardEffectTabContent';
import FeaturesTabContent from './tabs-content/FeaturesTabContent';

export interface CustomizeTabProps {
  customization: EventCustomization;
  onCustomizationChange: (customization: EventCustomization) => void;
  handleNextTab?: () => void;
}

const CustomizeTab: React.FC<CustomizeTabProps> = ({ 
  customization, 
  onCustomizationChange,
  handleNextTab 
}) => {
  const [activeTab, setActiveTab] = React.useState('background');

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="background" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-3 sm:grid-cols-7">
            <TabsTrigger value="background" onClick={() => setActiveTab('background')}>
              Background
            </TabsTrigger>
            <TabsTrigger value="text" onClick={() => setActiveTab('text')}>
              Text
            </TabsTrigger>
            <TabsTrigger value="buttons" onClick={() => setActiveTab('buttons')}>
              Buttons
            </TabsTrigger>
            <TabsTrigger value="header" onClick={() => setActiveTab('header')} className="hidden sm:inline-flex">
              Header
            </TabsTrigger>
            <TabsTrigger value="effects" onClick={() => setActiveTab('effects')} className="hidden sm:inline-flex">
              Effects
            </TabsTrigger>
            <TabsTrigger value="animations" onClick={() => setActiveTab('animations')} className="hidden sm:inline-flex">
              Animations
            </TabsTrigger>
            <TabsTrigger value="features" onClick={() => setActiveTab('features')} className="hidden sm:inline-flex">
              Features
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="mt-6 p-2">
          {activeTab === 'background' && (
            <BackgroundTabContent
              background={customization.background}
              onBackgroundChange={(background) => onCustomizationChange({ 
                ...customization, 
                background 
              })}
            />
          )}
          
          {activeTab === 'text' && (
            <TextTabContent
              font={customization.font}
              onFontChange={(font) => onCustomizationChange({
                ...customization,
                font
              })}
            />
          )}
          
          {activeTab === 'buttons' && (
            <ButtonsTabContent
              buttons={customization.buttons}
              onButtonsChange={(buttons) => onCustomizationChange({
                ...customization,
                buttons
              })}
            />
          )}
          
          {activeTab === 'header' && (
            <HeaderTabContent
              headerStyle={customization.headerStyle}
              onHeaderStyleChange={(headerStyle) => onCustomizationChange({
                ...customization,
                headerStyle
              })}
            />
          )}
          
          {activeTab === 'animations' && (
            <AnimationsTabContent
              animation={customization.animation}
              elementAnimations={customization.elementAnimations}
              onAnimationChange={(animation) => onCustomizationChange({
                ...customization,
                animation
              })}
              onElementAnimationsChange={(elementAnimations) => onCustomizationChange({
                ...customization,
                elementAnimations
              })}
            />
          )}
          
          {activeTab === 'effects' && (
            <CardEffectTabContent
              cardEffect={customization.cardEffect}
              onCardEffectChange={(cardEffect) => onCustomizationChange({
                ...customization,
                cardEffect
              })}
            />
          )}
          
          {activeTab === 'features' && (
            <FeaturesTabContent
              enableChatbot={customization.enableChatbot}
              showAcceptDeclineButtons={customization.showAcceptDeclineButtons}
              showAddToCalendarButton={customization.showAddToCalendarButton}
              mapDisplay={customization.mapDisplay}
              onFeatureChange={(key, value) => onCustomizationChange({
                ...customization,
                [key]: value
              })}
            />
          )}
        </div>
      </Tabs>
      
      {handleNextTab && (
        <div className="pt-4 flex justify-end">
          <Button 
            type="button" 
            onClick={handleNextTab}
            className="px-6"
          >
            Next: Share
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomizeTab;
