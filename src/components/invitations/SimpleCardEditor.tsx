
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InvitationPreview from './InvitationPreview';
import { SimpleInvitation, SimpleInvitationCustomization, BackgroundType, TextPosition, ButtonPosition, ButtonShape } from '@/types/invitation.types';

// Define text alignment type
type TextAlign = 'left' | 'center' | 'right';

interface SimpleCardEditorProps {
  invitation: Partial<SimpleInvitation>;
  onInvitationChange: (invitation: Partial<SimpleInvitation>) => void;
  onCustomizationChange: (customization: SimpleInvitationCustomization) => void;
  onSave: () => void;
  onSaveDraft?: () => void;
}

const SimpleCardEditor: React.FC<SimpleCardEditorProps> = ({
  invitation,
  onInvitationChange,
  onCustomizationChange,
  onSave,
  onSaveDraft
}) => {
  const [activeTab, setActiveTab] = useState('details');

  const handleChange = (field: string, value: string) => {
    onInvitationChange({
      ...invitation,
      [field]: value
    });
  };

  const handleBackgroundTypeChange = (type: BackgroundType) => {
    const updatedBackground = {
      ...invitation.customization?.background,
      type
    };
    handleCustomizationChange('background', updatedBackground);
  };

  const handleBackgroundValueChange = (value: string) => {
    const updatedBackground = {
      ...invitation.customization?.background,
      value
    };
    handleCustomizationChange('background', updatedBackground);
  };

  const handleFontChange = (property: string, value: string) => {
    const updatedFont = {
      ...invitation.customization?.font,
      [property]: value
    };
    handleCustomizationChange('font', updatedFont);
  };

  const handleCustomizationChange = (section: string, value: any) => {
    if (!invitation.customization) return;
    
    const updatedCustomization: SimpleInvitationCustomization = {
      ...invitation.customization,
      [section]: value
    };
    
    onCustomizationChange(updatedCustomization);
  };

  const handleButtonChange = (buttonType: 'accept' | 'decline' | 'directions' | 'calendar', property: string, value: any) => {
    if (!invitation.customization?.buttons) return;
    
    const updatedButtons = {
      ...invitation.customization.buttons,
      [buttonType]: {
        ...invitation.customization.buttons[buttonType],
        [property]: value
      }
    };
    
    handleCustomizationChange('buttons', updatedButtons);
  };

  const handleTextLayoutChange = (property: string, value: any) => {
    const updatedTextLayout = {
      ...invitation.customization?.textLayout,
      [property]: value
    };
    handleCustomizationChange('textLayout', updatedTextLayout);
  };

  const defaultCustomization: SimpleInvitationCustomization = {
    background: {
      type: 'solid',
      value: '#ffffff'
    },
    font: {
      family: 'system-ui, sans-serif',
      size: 'medium',
      color: '#000000',
      alignment: 'center'
    },
    buttons: {
      accept: {
        background: '#3B82F6',
        color: '#ffffff',
        shape: 'rounded'
      },
      decline: {
        background: '#EF4444',
        color: '#ffffff',
        shape: 'rounded'
      },
      directions: {
        show: false,
        background: '#3B82F6',
        color: '#ffffff',
        shape: 'rounded',
        position: 'bottom-right'
      },
      calendar: {
        show: false,
        background: '#3B82F6',
        color: '#ffffff',
        shape: 'rounded',
        position: 'bottom-left'
      }
    },
    textLayout: {
      contentPosition: 'middle',
      spacing: 'normal'
    }
  };

  // Ensure customization object exists
  const customization = invitation.customization || defaultCustomization;

  const backgroundOptions: { label: string; value: BackgroundType }[] = [
    { label: 'Solid Color', value: 'solid' },
    { label: 'Gradient', value: 'gradient' },
    { label: 'Image', value: 'image' }
  ];

  const backgroundPresets = {
    solid: ['#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#adb5bd', '#212529'],
    gradient: [
      'linear-gradient(45deg, #4158D0, #C850C0, #FFCC70)',
      'linear-gradient(to right, #8360c3, #2ebf91)',
      'linear-gradient(to right, #ff8177, #cf556c)',
      'linear-gradient(to right, #6a85b6, #bac8e0)',
      'linear-gradient(to right, #00b09b, #96c93d)'
    ]
  };

  const fontOptions = [
    { label: 'System', value: 'system-ui, sans-serif' },
    { label: 'Serif', value: 'Georgia, serif' },
    { label: 'Mono', value: 'monospace' }
  ];

  const fontSizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' }
  ];

  const buttonShapeOptions: { label: string; value: ButtonShape }[] = [
    { label: 'Rounded', value: 'rounded' },
    { label: 'Pill', value: 'pill' },
    { label: 'Square', value: 'square' }
  ];

  const textPositionOptions: { label: string; value: TextPosition }[] = [
    { label: 'Top', value: 'top' },
    { label: 'Middle', value: 'middle' },
    { label: 'Bottom', value: 'bottom' }
  ];

  const buttonPositionOptions: { label: string; value: ButtonPosition }[] = [
    { label: 'Bottom Left', value: 'bottom-left' },
    { label: 'Bottom Center', value: 'bottom-center' },
    { label: 'Bottom Right', value: 'bottom-right' },
    { label: 'Top Right', value: 'top-right' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor section */}
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={invitation.title || ''} 
                    onChange={(e) => handleChange('title', e.target.value)} 
                    placeholder="Enter title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={invitation.description || ''} 
                    onChange={(e) => handleChange('description', e.target.value)} 
                    placeholder="Enter description"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={invitation.date || ''} 
                      onChange={(e) => handleChange('date', e.target.value)} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input 
                      id="time" 
                      type="time" 
                      value={invitation.time || ''} 
                      onChange={(e) => handleChange('time', e.target.value)} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={invitation.location || ''} 
                    onChange={(e) => handleChange('location', e.target.value)} 
                    placeholder="Enter location"
                  />
                </div>
              </TabsContent>

              <TabsContent value="design" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Background</h3>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {backgroundOptions.map(option => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={customization.background.type === option.value ? "default" : "outline"}
                        onClick={() => handleBackgroundTypeChange(option.value)}
                        className="h-auto py-2"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>

                  {customization.background.type === 'solid' && (
                    <div className="space-y-2">
                      <Label>Select Color</Label>
                      <div className="grid grid-cols-6 gap-2">
                        {backgroundPresets.solid.map(color => (
                          <div 
                            key={color}
                            className={`w-full aspect-square rounded border cursor-pointer ${customization.background.value === color ? 'ring-2 ring-primary' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleBackgroundValueChange(color)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {customization.background.type === 'gradient' && (
                    <div className="space-y-2">
                      <Label>Select Gradient</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {backgroundPresets.gradient.map(gradient => (
                          <div 
                            key={gradient}
                            className={`h-10 rounded cursor-pointer ${customization.background.value === gradient ? 'ring-2 ring-primary' : ''}`}
                            style={{ background: gradient }}
                            onClick={() => handleBackgroundValueChange(gradient)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {customization.background.type === 'image' && (
                    <div className="space-y-2">
                      <Label htmlFor="bg-image-url">Image URL</Label>
                      <Input 
                        id="bg-image-url" 
                        value={customization.background.value} 
                        onChange={(e) => handleBackgroundValueChange(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Text Style</h3>
                  
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {fontOptions.map(option => (
                        <Button
                          key={option.value}
                          type="button"
                          variant={customization.font.family === option.value ? "default" : "outline"}
                          onClick={() => handleFontChange('family', option.value)}
                          className="h-auto py-2"
                          style={{ fontFamily: option.value }}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {fontSizeOptions.map(option => (
                        <Button
                          key={option.value}
                          type="button"
                          variant={customization.font.size === option.value ? "default" : "outline"}
                          onClick={() => handleFontChange('size', option.value)}
                          className="h-auto py-2"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={customization.font.color}
                        onChange={(e) => handleFontChange('color', e.target.value)}
                        className="w-10 h-10 p-1"
                      />
                      <span className="text-sm text-muted-foreground">{customization.font.color}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Text Alignment</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['left', 'center', 'right'].map((align) => (
                        <Button
                          key={align}
                          type="button"
                          variant={customization.font.alignment === align ? "default" : "outline"}
                          onClick={() => handleFontChange('alignment', align as TextAlign)}
                          className="h-auto py-2"
                        >
                          {align.charAt(0).toUpperCase() + align.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Layout</h3>
                  
                  <div className="space-y-2">
                    <Label>Content Position</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {textPositionOptions.map(option => (
                        <Button
                          key={option.value}
                          type="button"
                          variant={customization.textLayout?.contentPosition === option.value ? "default" : "outline"}
                          onClick={() => handleTextLayoutChange('contentPosition', option.value)}
                          className="h-auto py-2"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Utility Buttons</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="directions-button"
                        checked={customization.buttons?.directions?.show || false}
                        onChange={(e) => handleButtonChange('directions', 'show', e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="directions-button">Show Directions Button</Label>
                    </div>
                    
                    {customization.buttons?.directions?.show && (
                      <div className="pl-6 border-l-2 border-gray-200 mt-2 space-y-2">
                        <Label>Button Position</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {buttonPositionOptions.map(option => (
                            <Button
                              key={option.value}
                              type="button"
                              variant={customization.buttons?.directions?.position === option.value ? "default" : "outline"}
                              onClick={() => handleButtonChange('directions', 'position', option.value)}
                              className="h-auto py-1 text-xs"
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="calendar-button"
                        checked={customization.buttons?.calendar?.show || false}
                        onChange={(e) => handleButtonChange('calendar', 'show', e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="calendar-button">Show Calendar Button</Label>
                    </div>
                    
                    {customization.buttons?.calendar?.show && (
                      <div className="pl-6 border-l-2 border-gray-200 mt-2 space-y-2">
                        <Label>Button Position</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {buttonPositionOptions.map(option => (
                            <Button
                              key={option.value}
                              type="button"
                              variant={customization.buttons?.calendar?.position === option.value ? "default" : "outline"}
                              onClick={() => handleButtonChange('calendar', 'position', option.value)}
                              className="h-auto py-1 text-xs"
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          {onSaveDraft && (
            <Button variant="outline" onClick={onSaveDraft}>
              Save Draft
            </Button>
          )}
          <Button onClick={onSave}>
            Create Invitation
          </Button>
        </div>
      </div>

      {/* Preview section */}
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Preview</h2>
            <InvitationPreview
              title={invitation.title}
              description={invitation.description}
              location={invitation.location}
              date={invitation.date}
              time={invitation.time}
              customization={customization}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleCardEditor;
