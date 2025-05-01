
import React, { useState, useRef, DragEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; 
import { SimpleInvitation, SimpleInvitationCustomization, BackgroundType } from '@/types/invitation.types';
import { HexColorPicker } from 'react-colorful';
import { Save, Calendar, MapPin, Clock, Image, Upload, Move } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';

interface ElementItem {
  id: string;
  type: 'title' | 'description' | 'date' | 'location' | 'button';
  label: string;
  icon: React.ReactNode;
}

interface SimpleCardEditorProps {
  invitation: Partial<SimpleInvitation>;
  onInvitationChange: (invitation: Partial<SimpleInvitation>) => void;
  onCustomizationChange: (customization: SimpleInvitationCustomization) => void;
  onSaveDraft: () => void;
  onSave: () => void;
}

const SimpleCardEditor: React.FC<SimpleCardEditorProps> = ({
  invitation,
  onInvitationChange,
  onCustomizationChange,
  onSaveDraft,
  onSave
}) => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    invitation.date ? new Date(invitation.date) : undefined
  );

  const customization = invitation.customization || {
    background: {
      type: 'solid' as BackgroundType,
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
        shape: 'rounded',
      },
      decline: {
        background: '#EF4444',
        color: '#ffffff',
        shape: 'rounded',
      },
      directions: {
        show: !!invitation.location,
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
    }
  };

  const elementItems: ElementItem[] = [
    { id: 'title', type: 'title', label: 'Title', icon: <Move className="w-4 h-4 mr-1" /> },
    { id: 'description', type: 'description', label: 'Description', icon: <Move className="w-4 h-4 mr-1" /> },
    { id: 'date', type: 'date', label: 'Date & Time', icon: <Calendar className="w-4 h-4 mr-1" /> },
    { id: 'location', type: 'location', label: 'Location', icon: <MapPin className="w-4 h-4 mr-1" /> }
  ];

  const handleDragStart = (e: DragEvent<HTMLDivElement>, elementId: string) => {
    setDraggedElement(elementId);
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', elementId);
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedElement || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the card
    const y = e.clientY - rect.top;  // y position within the card
    
    console.log(`Dropped ${draggedElement} at position: (${x}, ${y})`);
    
    // Handle the drop based on element type
    // In a real implementation, we would update element positions in the invitation state
    setDraggedElement(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleBackgroundColorChange = (color: string) => {
    const updatedCustomization = {
      ...customization,
      background: {
        ...customization.background,
        type: 'solid' as BackgroundType,
        value: color
      }
    };
    onCustomizationChange(updatedCustomization);
  };

  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedCustomization = {
          ...customization,
          background: {
            ...customization.background,
            type: 'image' as BackgroundType,
            value: reader.result as string
          }
        };
        onCustomizationChange(updatedCustomization);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInvitationChange = (field: string, value: string) => {
    onInvitationChange({ ...invitation, [field]: value });
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      onInvitationChange({ 
        ...invitation, 
        date: format(date, 'yyyy-MM-dd')
      });
    }
  };

  const getBackgroundStyle = () => {
    if (customization.background.type === 'image') {
      return {
        backgroundImage: `url(${customization.background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return { backgroundColor: customization.background.value };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left panel - Elements and controls */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <h2 className="text-lg font-medium">Elements</h2>
          <div className="grid grid-cols-2 gap-3">
            {elementItems.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                className="flex items-center p-3 bg-gray-100 rounded-md cursor-move hover:bg-gray-200 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <h2 className="text-lg font-medium">Card Content</h2>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
              <Input
                id="title"
                value={invitation.title || ''}
                onChange={(e) => handleInvitationChange('title', e.target.value)}
                placeholder="Enter invitation title"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                id="description"
                value={invitation.description || ''}
                onChange={(e) => handleInvitationChange('description', e.target.value)}
                placeholder="Enter invitation description"
                rows={3}
              />
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
              <DatePicker 
                date={selectedDate}
                setDate={handleDateChange}
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="time" className="block text-sm font-medium mb-1">Time</label>
              <Input
                id="time"
                type="time"
                value={invitation.time || ''}
                onChange={(e) => handleInvitationChange('time', e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
              <Input
                id="location"
                value={invitation.location || ''}
                onChange={(e) => handleInvitationChange('location', e.target.value)}
                placeholder="Enter location"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <h2 className="text-lg font-medium">Background</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button
                variant={customization.background.type === 'solid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  const updatedCustomization = {
                    ...customization,
                    background: { ...customization.background, type: 'solid' }
                  };
                  onCustomizationChange(updatedCustomization);
                  setShowColorPicker(true);
                }}
              >
                Solid Color
              </Button>
              
              <Button
                variant={customization.background.type === 'image' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  const updatedCustomization = {
                    ...customization,
                    background: { ...customization.background, type: 'image' }
                  };
                  onCustomizationChange(updatedCustomization);
                  setShowColorPicker(false);
                }}
              >
                Image
              </Button>
            </div>
            
            {customization.background.type === 'solid' && (
              <div className="space-y-2">
                <div 
                  className="h-8 w-full rounded-md border cursor-pointer"
                  style={{ backgroundColor: customization.background.value }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                {showColorPicker && (
                  <div className="mt-2">
                    <HexColorPicker 
                      color={customization.background.value} 
                      onChange={handleBackgroundColorChange}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            )}
            
            {customization.background.type === 'image' && (
              <div className="space-y-2">
                <label htmlFor="bgImage" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <Image className="mr-2 h-4 w-4" />
                  Upload Image
                  <input 
                    id="bgImage"
                    type="file" 
                    className="hidden" 
                    onChange={handleBackgroundImageChange}
                    accept="image/*"
                  />
                </label>
                {customization.background.value && customization.background.type === 'image' && (
                  <div className="mt-2 relative w-full h-20 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={customization.background.value} 
                      alt="Background preview" 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-4 justify-end">
          <Button variant="outline" onClick={onSaveDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={onSave}>
            Create Invitation
          </Button>
        </div>
      </div>
      
      {/* Right panel - Preview card */}
      <div className="w-full max-w-md mx-auto">
        <div 
          ref={cardRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="relative"
        >
          <Card 
            className="w-full overflow-hidden shadow-lg"
            style={{
              height: '500px',
              ...getBackgroundStyle(),
              color: customization.font.color,
              fontFamily: customization.font.family,
            }}
          >
            <div className="h-full p-6 flex flex-col relative">
              {/* Card content */}
              {invitation.title && (
                <h2 
                  className="text-2xl font-bold text-center mb-2"
                  style={{ textAlign: customization.font.alignment || 'center' }}
                >
                  {invitation.title}
                </h2>
              )}
              
              {(invitation.date || invitation.time) && (
                <div className="text-center mb-4">
                  {invitation.date && (
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : invitation.date}
                      </span>
                      {invitation.time && (
                        <>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{invitation.time}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {invitation.description && (
                <p 
                  className="text-center mb-4"
                  style={{ textAlign: customization.font.alignment || 'center' }}
                >
                  {invitation.description}
                </p>
              )}
              
              {invitation.location && (
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{invitation.location}</span>
                  </div>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="mt-auto flex justify-between w-full">
                {invitation.date && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    style={{
                      backgroundColor: customization.buttons?.calendar?.background,
                      color: customization.buttons?.calendar?.color,
                    }}
                  >
                    <Calendar className="h-3 w-3 mr-1" /> Add to Calendar
                  </Button>
                )}
                
                {invitation.location && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs ml-auto"
                    style={{
                      backgroundColor: customization.buttons?.directions?.background,
                      color: customization.buttons?.directions?.color,
                    }}
                  >
                    <MapPin className="h-3 w-3 mr-1" /> Get Directions
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          Drag elements from left panel and drop them on the card to customize layout
        </div>
      </div>
    </div>
  );
};

export default SimpleCardEditor;
