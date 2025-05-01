
import React, { useState } from 'react';
import { 
  SimpleInvitationCustomization, 
  BackgroundType,
  ButtonPosition,
  ButtonShape,
  TextPosition
} from '@/types/invitation.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BackgroundSelector from './BackgroundSelector';
import FontSelector from '@/components/events/customize/FontSelector';
import { handleImageGeneration } from '@/hooks/ai/utils/imageHandling';
import { toast } from '@/components/ui/use-toast';
import ButtonStyler from './ButtonStyler';
import TextPositionSelector from './TextPositionSelector';

interface InvitationStylerProps {
  customization: SimpleInvitationCustomization;
  onChange: (customization: SimpleInvitationCustomization) => void;
  title?: string;
  description?: string;
  hasLocation?: boolean;
  isEvent?: boolean;
}

export default function InvitationStyler({
  customization,
  onChange,
  title,
  description,
  hasLocation = false,
  isEvent = false
}: InvitationStylerProps) {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  const handleBackgroundChange = (type: BackgroundType, value: string) => {
    onChange({
      ...customization,
      background: { type, value }
    });
  };

  const handleFontChange = (property: string, value: string) => {
    onChange({
      ...customization,
      font: {
        ...customization.font,
        [property]: value
      }
    });
  };

  const handleTextPositionChange = (position: TextPosition) => {
    // Initialize textLayout if it doesn't exist
    const textLayout = customization.textLayout || { 
      contentPosition: 'middle',
      spacing: 'normal' 
    };
    
    onChange({
      ...customization,
      textLayout: {
        ...textLayout,
        contentPosition: position
      }
    });
  };

  const handleTextSpacingChange = (spacing: 'compact' | 'normal' | 'spacious') => {
    const textLayout = customization.textLayout || { 
      contentPosition: 'middle',
      spacing: 'normal' 
    };
    
    onChange({
      ...customization,
      textLayout: {
        ...textLayout,
        spacing
      }
    });
  };

  const handleButtonChange = (
    buttonType: 'directions' | 'calendar',
    property: 'background' | 'color' | 'shape' | 'position' | 'show',
    value: string | boolean
  ) => {
    // Initialize buttons object if it doesn't exist
    const buttons = customization.buttons || {
      accept: { background: '#4CAF50', color: '#ffffff', shape: 'rounded' },
      decline: { background: '#f44336', color: '#ffffff', shape: 'rounded' },
    };
    
    // Initialize the specific button type if it doesn't exist
    const buttonDefaults = {
      directions: {
        background: '#ffffff',
        color: '#000000',
        shape: 'rounded' as ButtonShape,
        position: 'bottom-right' as ButtonPosition,
        show: true
      },
      calendar: {
        background: '#ffffff',
        color: '#000000',
        shape: 'rounded' as ButtonShape,
        position: 'bottom-right' as ButtonPosition,
        show: true
      }
    };
    
    const buttonConfig = buttons[buttonType] || buttonDefaults[buttonType];
    
    onChange({
      ...customization,
      buttons: {
        ...buttons,
        [buttonType]: {
          ...buttonConfig,
          [property]: value
        }
      }
    });
  };

  const handleGenerateAIBackground = async () => {
    if (!title && !description && !aiPrompt) {
      toast({
        title: "Missing Information",
        description: "Please add a title, description, or custom prompt to generate an AI background.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGeneratingImage(true);
      
      // Use custom prompt if provided, otherwise generate one based on invitation details
      let prompt = aiPrompt || `Create a beautiful invitation background image for "${title || 'an event'}"`;
      if (description && !aiPrompt) {
        prompt += ` with description "${description}".`;
      }
      prompt += " Make it high quality, visually appealing, and suitable for a digital invitation card with aspect ratio 4:3.";
      
      const result = await handleImageGeneration(prompt);
      
      if (result.success && result.imageUrl) {
        handleBackgroundChange('image', result.imageUrl);
        toast({
          title: "Background Generated",
          description: "Your AI background has been created and applied.",
        });
      } 
    } catch (error) {
      console.error('Error generating AI background:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your background image.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="background" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="background">Background</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
        </TabsList>

        <TabsContent value="background" className="mt-4">
          <BackgroundSelector 
            backgroundType={customization.background.type}
            backgroundValue={customization.background.value}
            onBackgroundChange={handleBackgroundChange}
            onGenerateAIBackground={handleGenerateAIBackground}
            title={title}
            description={description}
            isGeneratingImage={isGeneratingImage}
          />
        </TabsContent>

        <TabsContent value="text" className="mt-4">
          <div className="space-y-6">
            <FontSelector
              font={customization.font}
              onFontChange={handleFontChange}
              showAlignment={true}
              previewText={title || "Your invitation title will appear here"}
            />
            
            <TextPositionSelector
              contentPosition={customization.textLayout?.contentPosition || 'middle'}
              spacing={customization.textLayout?.spacing || 'normal'}
              onPositionChange={handleTextPositionChange}
              onSpacingChange={handleTextSpacingChange}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="buttons" className="mt-4">
          <ButtonStyler 
            buttons={customization.buttons}
            onButtonChange={handleButtonChange}
            hasLocation={hasLocation}
            isEvent={isEvent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
