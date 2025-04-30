
import React, { useState, useEffect } from 'react';
import { useAIImageGeneration } from '@/hooks/ai/useAIImageGeneration';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EventCustomization } from '@/types/event.types';
import { Loader2, RefreshCcw, ImageIcon, Check, Palette } from 'lucide-react';

interface EventCustomizeFormProps {
  onSubmit: (customization: EventCustomization) => void;
  initialData?: Partial<EventCustomization>;
  eventTitle?: string;
  eventDescription?: string;
}

export const EventCustomizeForm: React.FC<EventCustomizeFormProps> = ({ 
  onSubmit, 
  initialData,
  eventTitle,
  eventDescription
}) => {
  const [activeTab, setActiveTab] = useState<string>('background');
  const [customization, setCustomization] = useState<EventCustomization>({
    background: {
      type: 'solid',
      value: '#ffffff'
    },
    font: {
      family: 'Inter, sans-serif',
      size: 'medium',
      color: '#333333'
    },
    buttons: {
      accept: {
        background: '#4caf50',
        color: '#ffffff',
        shape: 'rounded'
      },
      decline: {
        background: '#f44336',
        color: '#ffffff',
        shape: 'rounded'
      }
    },
    ...initialData
  });
  const [backgroundPrompt, setBackgroundPrompt] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(
    customization?.background?.type === 'solid' ? customization.background.value : '#ffffff'
  );
  
  const { 
    generateImage, 
    isGenerating, 
    generatedImage, 
    clearGeneratedImage 
  } = useAIImageGeneration();

  useEffect(() => {
    if (eventTitle && eventDescription) {
      setBackgroundPrompt(`Event invitation for "${eventTitle}": ${eventDescription?.substring(0, 60)}${eventDescription && eventDescription.length > 60 ? '...' : ''}`);
    } else if (eventTitle) {
      setBackgroundPrompt(`Event invitation for "${eventTitle}"`);
    }
  }, [eventTitle, eventDescription]);
  
  const handleGenerateBackground = async () => {
    try {
      const result = await generateImage.mutateAsync({ 
        prompt: backgroundPrompt || `Beautiful event background for a digital invitation card`
      });
      
      if (result?.imageUrl) {
        setCustomization({
          ...customization,
          background: {
            type: 'image',
            value: result.imageUrl
          }
        });
      }
    } catch (error) {
      console.error("Failed to generate background:", error);
    }
  };
  
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setCustomization({
      ...customization,
      background: {
        type: 'solid',
        value: color
      }
    });
  };
  
  const handleFontChange = (property: string, value: string) => {
    setCustomization({
      ...customization,
      font: {
        ...customization.font,
        [property]: value
      }
    });
  };
  
  const handleButtonStyleChange = (button: 'accept' | 'decline', property: string, value: string) => {
    setCustomization({
      ...customization,
      buttons: {
        ...customization.buttons,
        [button]: {
          ...customization.buttons[button],
          [property]: value
        }
      }
    });
  };
  
  const handleSubmit = () => {
    onSubmit(customization);
  };
  
  const predefinedColors = [
    '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', 
    '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef',
    '#ec4899', '#f43f5e', '#ef4444', '#f97316',
    '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9'
  ];
  
  const fontOptions = [
    { value: 'Inter, sans-serif', label: 'Inter (Modern)' },
    { value: 'Roboto, sans-serif', label: 'Roboto (Clean)' },
    { value: 'Georgia, serif', label: 'Georgia (Elegant)' },
    { value: 'Arial, sans-serif', label: 'Arial (Standard)' },
    { value: 'Courier New, monospace', label: 'Courier (Typewriter)' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Customize Event Appearance</h3>
      </div>
      
      <Tabs defaultValue="background" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="background">
            <ImageIcon className="h-4 w-4 mr-2" />
            Background
          </TabsTrigger>
          <TabsTrigger value="styles">
            <Palette className="h-4 w-4 mr-2" />
            Styles
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="background" className="space-y-4">
          <Card>
            <CardContent className="pt-6 pb-4">
              {customization.background.type === 'image' && customization.background.value ? (
                <div className="relative aspect-[3/2] rounded-md overflow-hidden mb-4">
                  <img 
                    src={customization.background.value}
                    alt="Event background"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div 
                  className="aspect-[3/2] rounded-md mb-4"
                  style={{ backgroundColor: customization.background.value }}
                ></div>
              )}
              
              <div className="space-y-4">
                <div>
                  <RadioGroup 
                    defaultValue={customization.background.type}
                    onValueChange={(value) => {
                      setCustomization({
                        ...customization,
                        background: {
                          ...customization.background,
                          type: value as 'solid' | 'image'
                        }
                      });
                    }}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="solid" id="solid" />
                      <Label htmlFor="solid">Solid Color</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="image" id="image" />
                      <Label htmlFor="image">Image</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {customization.background.type === 'solid' ? (
                  <div className="space-y-2">
                    <Label>Select Color</Label>
                    <div className="grid grid-cols-10 gap-2">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-6 h-6 rounded-full border ${selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : 'border-gray-300'}`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleColorChange(color)}
                          aria-label={`Select ${color} color`}
                        />
                      ))}
                    </div>
                    <div className="pt-2">
                      <Input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-full h-10"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Generate AI Background</Label>
                    <div className="space-y-2">
                      <Input
                        placeholder="Describe the background you want..."
                        value={backgroundPrompt}
                        onChange={(e) => setBackgroundPrompt(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={handleGenerateBackground}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <ImageIcon className="mr-2 h-4 w-4" />
                              Generate Background
                            </>
                          )}
                        </Button>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            clearGeneratedImage();
                            setCustomization({
                              ...customization,
                              background: {
                                type: 'solid',
                                value: '#ffffff'
                              }
                            });
                          }}
                          disabled={isGenerating}
                        >
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="styles" className="space-y-4">
          <Card>
            <CardContent className="pt-6 pb-4">
              <div className="space-y-4">
                <div>
                  <Label>Font Family</Label>
                  <RadioGroup 
                    value={customization.font.family}
                    onValueChange={(value) => handleFontChange('family', value)}
                    className="grid grid-cols-1 gap-2 mt-2"
                  >
                    {fontOptions.map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`font-${option.value}`} />
                        <Label 
                          htmlFor={`font-${option.value}`} 
                          style={{ fontFamily: option.value }}
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <Label>Button Style</Label>
                    <div className="space-y-2 mt-2">
                      <Button 
                        className="w-full"
                        style={{
                          backgroundColor: customization.buttons.accept.background,
                          color: customization.buttons.accept.color,
                          borderRadius: customization.buttons.accept.shape === 'rounded' ? '0.375rem' 
                            : customization.buttons.accept.shape === 'pill' ? '9999px' : '0'
                        }}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <Button 
                        type="button"
                        size="sm" 
                        variant={customization.buttons.accept.shape === 'rounded' ? 'default' : 'outline'}
                        onClick={() => handleButtonStyleChange('accept', 'shape', 'rounded')}
                        className="text-xs h-7"
                      >
                        Rounded
                      </Button>
                      <Button 
                        type="button"
                        size="sm" 
                        variant={customization.buttons.accept.shape === 'pill' ? 'default' : 'outline'}
                        onClick={() => handleButtonStyleChange('accept', 'shape', 'pill')}
                        className="text-xs h-7"
                      >
                        Pill
                      </Button>
                      <Button 
                        type="button"
                        size="sm" 
                        variant={customization.buttons.accept.shape === 'square' ? 'default' : 'outline'}
                        onClick={() => handleButtonStyleChange('accept', 'shape', 'square')}
                        className="text-xs h-7"
                      >
                        Square
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Button Colors</Label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {['#4caf50', '#3b82f6', '#8b5cf6', '#f97316', '#f43f5e'].map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-6 h-6 rounded-full border ${customization.buttons.accept.background === color ? 'ring-2 ring-primary ring-offset-2' : 'border-gray-300'}`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleButtonStyleChange('accept', 'background', color)}
                          aria-label={`Select ${color} color for accept button`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Button type="button" className="w-full" onClick={handleSubmit}>
        Save & Continue
      </Button>
    </div>
  );
};
