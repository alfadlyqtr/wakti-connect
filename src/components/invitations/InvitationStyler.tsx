
import React, { useState } from 'react';
import { 
  SimpleInvitationCustomization, 
  BackgroundType 
} from '@/types/invitation.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BackgroundSelector from './BackgroundSelector';
import FontSelector from '@/components/events/customize/FontSelector';
import { handleImageGeneration } from '@/hooks/ai/utils/imageHandling';
import { toast } from '@/components/ui/use-toast';

interface InvitationStylerProps {
  customization: SimpleInvitationCustomization;
  onChange: (customization: SimpleInvitationCustomization) => void;
  title?: string;
  description?: string;
}

export default function InvitationStyler({
  customization,
  onChange,
  title,
  description
}: InvitationStylerProps) {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

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

  const handleGenerateAIBackground = async (customPrompt?: string) => {
    // If no custom prompt and no title/description, show error
    if (!customPrompt && !title && !description) {
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
      let prompt = customPrompt || `Create a beautiful invitation background image for "${title || 'an event'}"`;
      if (description && !customPrompt) {
        prompt += ` with description "${description}".`;
      }
      
      // Log the prompt being used
      console.log("InvitationStyler: Using prompt for image generation:", prompt);
      
      // Add enhancement instructions if not in custom prompt
      if (!customPrompt) {
        prompt += " Make it high quality, visually appealing, and suitable for a digital invitation card with aspect ratio 4:3.";
      }
      
      const result = await handleImageGeneration(prompt);
      
      if (result.success && result.imageUrl) {
        handleBackgroundChange('image', result.imageUrl);
        toast({
          title: "Background Generated",
          description: customPrompt ? 
            "Your custom AI background has been created and applied." : 
            "Your AI background has been created and applied.",
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="background">Background</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
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
          <FontSelector
            font={customization.font}
            onFontChange={handleFontChange}
            showAlignment={true}
            previewText={title || "Your invitation title will appear here"}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
