
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ColorInput } from '@/components/inputs/ColorInput';
import { SimpleInvitationCustomization, SimpleInvitation, BackgroundType, TextPosition } from '@/types/invitation.types';
import { TextAlign } from '@/types/event.types';
import InvitationPreview from './InvitationPreview';

interface SimpleCardEditorProps {
  invitation?: Partial<SimpleInvitation>;
  isEvent?: boolean;
  onInvitationChange?: (invitation: Partial<SimpleInvitation>) => void;
  onCustomizationChange?: (customization: SimpleInvitationCustomization) => void;
  onSaveDraft?: () => void;
  onSave?: () => void;
}

const SimpleCardEditor: React.FC<SimpleCardEditorProps> = ({
  invitation = {},
  isEvent = false,
  onInvitationChange = () => {},
  onCustomizationChange = () => {},
  onSaveDraft = () => {},
  onSave = () => {}
}) => {
  // Default customization
  const defaultCustomization: SimpleInvitationCustomization = {
    background: {
      type: 'solid' as BackgroundType,
      value: '#ffffff'
    },
    font: {
      family: 'system-ui, sans-serif',
      size: 'medium',
      color: '#000000',
      alignment: 'center',
    },
    buttons: {
      accept: {
        background: '#3B82F6',
        color: '#ffffff',
        shape: 'rounded',
      },
      decline: {
        background: '#EF4444',
        color: '#ffffff',
        shape: 'rounded',
      },
      directions: {
        show: true,
        background: '#3B82F6',
        color: '#ffffff',
        shape: 'rounded',
        position: 'bottom-right'
      },
      calendar: {
        show: true,
        background: '#3B82F6',
        color: '#ffffff',
        shape: 'rounded',
        position: 'bottom-left'
      }
    },
    textLayout: {
      contentPosition: 'middle' as TextPosition,
      spacing: 'normal'
    }
  };

  // Use provided customization or default
  const [customization, setCustomization] = useState<SimpleInvitationCustomization>(
    invitation?.customization || defaultCustomization
  );

  // Form fields
  const [title, setTitle] = useState(invitation?.title || '');
  const [description, setDescription] = useState(invitation?.description || '');
  const [location, setLocation] = useState(invitation?.location || '');
  const [locationTitle, setLocationTitle] = useState(invitation?.locationTitle || '');
  const [date, setDate] = useState(invitation?.date || '');
  const [time, setTime] = useState(invitation?.time || '');

  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onInvitationChange({ ...invitation, title: newTitle });
  };

  // Handle description change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    onInvitationChange({ ...invitation, description: newDescription });
  };

  // Handle location change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setLocation(newLocation);
    onInvitationChange({ ...invitation, location: newLocation });
  };

  // Handle location title change
  const handleLocationTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocationTitle = e.target.value;
    setLocationTitle(newLocationTitle);
    onInvitationChange({ ...invitation, locationTitle: newLocationTitle });
  };

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    onInvitationChange({ ...invitation, date: newDate });
  };

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    onInvitationChange({ ...invitation, time: newTime });
  };

  // Update background color
  const handleBackgroundColorChange = (color: string) => {
    const newCustomization: SimpleInvitationCustomization = {
      ...customization,
      background: {
        ...customization.background,
        value: color
      }
    };
    setCustomization(newCustomization);
    onCustomizationChange(newCustomization);
  };

  // Update background type
  const handleBackgroundTypeChange = (type: BackgroundType) => {
    const newCustomization: SimpleInvitationCustomization = {
      ...customization,
      background: {
        ...customization.background,
        type: type
      }
    };
    setCustomization(newCustomization);
    onCustomizationChange(newCustomization);
  };

  // Update text color
  const handleTextColorChange = (color: string) => {
    const newCustomization: SimpleInvitationCustomization = {
      ...customization,
      font: {
        ...customization.font,
        color: color
      }
    };
    setCustomization(newCustomization);
    onCustomizationChange(newCustomization);
  };

  // Update text alignment
  const handleTextAlignmentChange = (alignment: TextAlign) => {
    const newCustomization: SimpleInvitationCustomization = {
      ...customization,
      font: {
        ...customization.font,
        alignment: alignment
      }
    };
    setCustomization(newCustomization);
    onCustomizationChange(newCustomization);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left panel with editable fields */}
      <div className="w-full lg:w-1/3 space-y-6">
        <Card className="p-4">
          <h2 className="text-lg font-bold mb-4">Content</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter invitation title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Enter invitation description"
                rows={4}
              />
            </div>

            {isEvent && (
              <>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-1">
                    Date
                  </label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium mb-1">
                    Time
                  </label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={handleTimeChange}
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                Location
              </label>
              <Input
                id="location"
                value={location}
                onChange={handleLocationChange}
                placeholder="Enter location address"
              />
            </div>

            <div>
              <label htmlFor="locationTitle" className="block text-sm font-medium mb-1">
                Location Name
              </label>
              <Input
                id="locationTitle"
                value={locationTitle}
                onChange={handleLocationTitleChange}
                placeholder="e.g. Office, Restaurant Name"
              />
            </div>
          </div>
        </Card>

        {/* Background customization */}
        <Card className="p-4">
          <h2 className="text-lg font-bold mb-4">Appearance</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Background Type</label>
              <div className="flex gap-2">
                <Button 
                  variant={customization.background.type === 'solid' ? "default" : "outline"}
                  onClick={() => handleBackgroundTypeChange('solid')}
                >
                  Solid
                </Button>
                <Button 
                  variant={customization.background.type === 'image' ? "default" : "outline"}
                  onClick={() => handleBackgroundTypeChange('image')}
                >
                  Image
                </Button>
                <Button 
                  variant={customization.background.type === 'ai' ? "default" : "outline"}
                  onClick={() => handleBackgroundTypeChange('ai')}
                >
                  AI
                </Button>
              </div>
            </div>

            {customization.background.type === 'solid' && (
              <div>
                <label className="block text-sm font-medium mb-1">Background Color</label>
                <ColorInput
                  value={customization.background.value}
                  onChange={handleBackgroundColorChange}
                  className="w-full"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Text Color</label>
              <ColorInput
                value={customization.font.color}
                onChange={handleTextColorChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Text Alignment</label>
              <div className="flex gap-2">
                <Button 
                  variant={customization.font.alignment === 'left' ? "default" : "outline"}
                  onClick={() => handleTextAlignmentChange('left')}
                >
                  Left
                </Button>
                <Button 
                  variant={customization.font.alignment === 'center' ? "default" : "outline"}
                  onClick={() => handleTextAlignmentChange('center')}
                >
                  Center
                </Button>
                <Button 
                  variant={customization.font.alignment === 'right' ? "default" : "outline"}
                  onClick={() => handleTextAlignmentChange('right')}
                >
                  Right
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onSaveDraft} className="flex-1">
            Save Draft
          </Button>
          <Button onClick={onSave} className="flex-1">
            Create
          </Button>
        </div>
      </div>

      {/* Right panel with preview */}
      <div className="w-full lg:w-2/3">
        <Card className="p-6 h-full flex flex-col items-center justify-center">
          <h2 className="text-lg font-bold mb-6">Preview</h2>
          <div className="w-full max-w-md">
            <InvitationPreview
              title={title || "Your Invitation Title"}
              description={description}
              location={location}
              locationTitle={locationTitle}
              date={date}
              time={time}
              customization={customization}
              isEvent={isEvent}
              showActions={true}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SimpleCardEditor;
