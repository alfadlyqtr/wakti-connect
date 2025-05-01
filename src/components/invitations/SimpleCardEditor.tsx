
import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HexColorPicker } from '@/components/ui/color-picker';
import InvitationForm from './InvitationForm';
import InvitationPreview from './InvitationPreview';
import { SimpleInvitation, SimpleInvitationCustomization, BackgroundType, TextPosition } from '@/types/invitation.types';

// Type imports for UI elements
import { TextAlign } from '@/types/event.types';

interface SimpleCardEditorProps {
  invitation: Partial<SimpleInvitation>;
  onInvitationChange: (invitation: Partial<SimpleInvitation>) => void;
  onCustomizationChange: (customization: SimpleInvitationCustomization) => void;
  onSave: () => void;
  onSaveDraft: () => void;
}

const SimpleCardEditor: React.FC<SimpleCardEditorProps> = ({
  invitation,
  onInvitationChange,
  onCustomizationChange,
  onSave,
  onSaveDraft,
}) => {
  const [activeTab, setActiveTab] = useState<string>('details');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleFieldChange = useCallback((field: string, value: string) => {
    onInvitationChange({
      ...invitation,
      [field]: value,
    });
  }, [invitation, onInvitationChange]);

  const handleBackgroundTypeChange = (type: BackgroundType) => {
    const customization = {
      ...invitation.customization!,
      background: {
        ...invitation.customization!.background,
        type: type,
      },
    };
    onCustomizationChange(customization);
  };

  const handleBackgroundValueChange = (value: string) => {
    const customization = {
      ...invitation.customization!,
      background: {
        ...invitation.customization!.background,
        value: value,
      },
    };
    onCustomizationChange(customization);
  };

  const handleFontFamilyChange = (family: string) => {
    const customization = {
      ...invitation.customization!,
      font: {
        ...invitation.customization!.font,
        family: family,
      },
    };
    onCustomizationChange(customization);
  };

  const handleFontSizeChange = (size: string) => {
    const customization = {
      ...invitation.customization!,
      font: {
        ...invitation.customization!.font,
        size: size,
      },
    };
    onCustomizationChange(customization);
  };

  const handleTextColorChange = (color: string) => {
    const customization = {
      ...invitation.customization!,
      font: {
        ...invitation.customization!.font,
        color: color,
      },
    };
    onCustomizationChange(customization);
  };

  const handleTextAlignChange = (align: TextAlign) => {
    const customization = {
      ...invitation.customization!,
      font: {
        ...invitation.customization!.font,
        alignment: align,
      },
    };
    onCustomizationChange(customization);
  };

  const handleTextPositionChange = (position: TextPosition) => {
    const customization = {
      ...invitation.customization!,
      textLayout: {
        ...invitation.customization!.textLayout!,
        contentPosition: position,
      },
    };
    onCustomizationChange(customization);
  };

  const handleDragStart = (event: React.DragEvent, item: string) => {
    setDraggedItem(item);
    event.dataTransfer.setData('text/plain', item);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    // In a real implementation, we would modify the position of elements
    // on the card based on the drop location
    setDraggedItem(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Elements</h3>
            <div className="space-y-2">
              <div 
                draggable
                onDragStart={(e) => handleDragStart(e, 'title')}
                className="p-3 border rounded bg-slate-100 cursor-move hover:bg-slate-200"
              >
                Title
              </div>
              <div 
                draggable
                onDragStart={(e) => handleDragStart(e, 'description')}
                className="p-3 border rounded bg-slate-100 cursor-move hover:bg-slate-200"
              >
                Description
              </div>
              <div 
                draggable
                onDragStart={(e) => handleDragStart(e, 'datetime')}
                className="p-3 border rounded bg-slate-100 cursor-move hover:bg-slate-200"
              >
                Date & Time
              </div>
              <div 
                draggable
                onDragStart={(e) => handleDragStart(e, 'location')}
                className="p-3 border rounded bg-slate-100 cursor-move hover:bg-slate-200"
              >
                Location
              </div>
              <div 
                draggable
                onDragStart={(e) => handleDragStart(e, 'button')}
                className="p-3 border rounded bg-slate-100 cursor-move hover:bg-slate-200"
              >
                Button
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Invitation Details</h3>
              <InvitationForm
                formData={{
                  title: invitation.title || '',
                  description: invitation.description || '',
                  date: invitation.date || '',
                  time: invitation.time || '',
                  location: invitation.location || '',
                  locationTitle: invitation.locationTitle || '',
                }}
                onChange={handleFieldChange}
                isEvent={!!invitation.isEvent}
              />
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Background</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={invitation.customization?.background.type === 'solid' ? 'default' : 'outline'}
                    onClick={() => handleBackgroundTypeChange('solid')}
                    className="flex-1"
                  >
                    Solid
                  </Button>
                  <Button
                    variant={invitation.customization?.background.type === 'image' ? 'default' : 'outline'}
                    onClick={() => handleBackgroundTypeChange('image')}
                    className="flex-1"
                  >
                    Image
                  </Button>
                  <Button
                    variant={invitation.customization?.background.type === 'ai' ? 'default' : 'outline'}
                    onClick={() => handleBackgroundTypeChange('ai')}
                    className="flex-1"
                  >
                    AI
                  </Button>
                </div>

                {invitation.customization?.background.type === 'solid' && (
                  <HexColorPicker
                    color={invitation.customization?.background.value || '#ffffff'}
                    onChange={handleBackgroundValueChange}
                    label="Background Color"
                  />
                )}

                {invitation.customization?.background.type === 'image' && (
                  <div className="space-y-2">
                    <input
                      type="file"
                      className="w-full"
                      accept="image/*"
                      // Image upload would be implemented here
                    />
                    <p className="text-sm text-muted-foreground">
                      Upload an image for your invitation background
                    </p>
                  </div>
                )}

                {invitation.customization?.background.type === 'ai' && (
                  <div className="space-y-2">
                    <textarea
                      className="w-full p-2 border rounded"
                      rows={3}
                      placeholder="Describe the background you want AI to generate..."
                    ></textarea>
                    <Button className="w-full">Generate Background</Button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Font</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Font Family</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={invitation.customization?.font.family}
                    onChange={(e) => handleFontFamilyChange(e.target.value)}
                  >
                    <option value="system-ui, sans-serif">System</option>
                    <option value="'Helvetica', sans-serif">Helvetica</option>
                    <option value="'Georgia', serif">Georgia</option>
                    <option value="'Courier New', monospace">Courier</option>
                    <option value="'Arial', sans-serif">Arial</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Font Size</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={invitation.customization?.font.size}
                    onChange={(e) => handleFontSizeChange(e.target.value)}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                
                <HexColorPicker
                  color={invitation.customization?.font.color || '#000000'}
                  onChange={handleTextColorChange}
                  label="Text Color"
                />
                
                <div>
                  <label className="block text-sm mb-1">Text Alignment</label>
                  <div className="flex gap-2">
                    <Button
                      variant={invitation.customization?.font.alignment === 'left' ? 'default' : 'outline'}
                      onClick={() => handleTextAlignChange('left' as TextAlign)}
                      className="flex-1"
                    >
                      Left
                    </Button>
                    <Button
                      variant={invitation.customization?.font.alignment === 'center' ? 'default' : 'outline'}
                      onClick={() => handleTextAlignChange('center' as TextAlign)}
                      className="flex-1"
                    >
                      Center
                    </Button>
                    <Button
                      variant={invitation.customization?.font.alignment === 'right' ? 'default' : 'outline'}
                      onClick={() => handleTextAlignChange('right' as TextAlign)}
                      className="flex-1"
                    >
                      Right
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="w-full md:w-2/3 flex flex-col">
          <Card className="p-4 h-full relative">
            <div 
              className="h-[500px] overflow-hidden relative bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <InvitationPreview
                title={invitation.title}
                description={invitation.description}
                location={invitation.location}
                locationTitle={invitation.locationTitle}
                date={invitation.date}
                time={invitation.time}
                customization={invitation.customization!}
                isEvent={!!invitation.isEvent}
                showActions={true}
              />
              
              {draggedItem && (
                <div className="absolute inset-0 bg-blue-100 bg-opacity-30 flex items-center justify-center">
                  <p className="text-lg font-medium">Drop {draggedItem} here</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onSaveDraft}>
          Save Draft
        </Button>
        <Button onClick={onSave}>
          Create
        </Button>
      </div>
    </div>
  );
};

export default SimpleCardEditor;
