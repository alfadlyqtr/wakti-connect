
import React from 'react';
import { useCustomization } from '../context';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

const ButtonsTabContent: React.FC = () => {
  const { 
    customization, 
    handleButtonStyleChange,
    handleToggleButtons,
    handleToggleCalendar
  } = useCustomization();
  
  const handleShapeChange = (buttonType: 'accept' | 'decline', shape: 'rounded' | 'pill' | 'square') => {
    handleButtonStyleChange(buttonType, 'shape', shape);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="show-buttons" className="text-base font-medium">Show Accept/Decline Buttons</Label>
        <Switch 
          id="show-buttons" 
          checked={customization.showAcceptDeclineButtons !== false}
          onCheckedChange={(checked) => handleToggleButtons && handleToggleButtons(checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-calendar" className="text-base font-medium">Show Add to Calendar Button</Label>
        <Switch 
          id="show-calendar" 
          checked={customization.showAddToCalendarButton !== false}
          onCheckedChange={(checked) => handleToggleCalendar && handleToggleCalendar(checked)}
        />
      </div>
      
      <Separator className="my-4" />
      
      <div className={customization.showAcceptDeclineButtons === false ? 'opacity-50 pointer-events-none' : ''}>
        <h3 className="font-medium text-base mb-4">Accept Button</h3>
        
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label>Button Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="color"
                value={customization.buttons?.accept?.background || '#4CAF50'}
                onChange={(e) => handleButtonStyleChange('accept', 'background', e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={customization.buttons?.accept?.background || '#4CAF50'}
                onChange={(e) => handleButtonStyleChange('accept', 'background', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Text Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="color"
                value={customization.buttons?.accept?.color || '#ffffff'}
                onChange={(e) => handleButtonStyleChange('accept', 'color', e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={customization.buttons?.accept?.color || '#ffffff'}
                onChange={(e) => handleButtonStyleChange('accept', 'color', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Button Shape</Label>
            <RadioGroup 
              value={customization.buttons?.accept?.shape || 'rounded'} 
              onValueChange={(value) => handleShapeChange('accept', value as 'rounded' | 'pill' | 'square')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rounded" id="accept-rounded" />
                <Label htmlFor="accept-rounded">Rounded</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pill" id="accept-pill" />
                <Label htmlFor="accept-pill">Pill</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="square" id="accept-square" />
                <Label htmlFor="accept-square">Square</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <h3 className="font-medium text-base mb-4">Decline Button</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Button Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="color"
                value={customization.buttons?.decline?.background || '#f44336'}
                onChange={(e) => handleButtonStyleChange('decline', 'background', e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={customization.buttons?.decline?.background || '#f44336'}
                onChange={(e) => handleButtonStyleChange('decline', 'background', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Text Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="color"
                value={customization.buttons?.decline?.color || '#ffffff'}
                onChange={(e) => handleButtonStyleChange('decline', 'color', e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={customization.buttons?.decline?.color || '#ffffff'}
                onChange={(e) => handleButtonStyleChange('decline', 'color', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Button Shape</Label>
            <RadioGroup 
              value={customization.buttons?.decline?.shape || 'rounded'} 
              onValueChange={(value) => handleShapeChange('decline', value as 'rounded' | 'pill' | 'square')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rounded" id="decline-rounded" />
                <Label htmlFor="decline-rounded">Rounded</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pill" id="decline-pill" />
                <Label htmlFor="decline-pill">Pill</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="square" id="decline-square" />
                <Label htmlFor="decline-square">Square</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="p-4 mt-6 rounded-md bg-muted/50 text-center">
        <p className="text-sm text-muted-foreground">
          Preview how your buttons will look in the event card
        </p>
        <div className="flex justify-center gap-3 mt-4">
          <button 
            className="py-2 px-4 flex items-center gap-1"
            style={{
              backgroundColor: customization.buttons?.accept?.background || '#4CAF50',
              color: customization.buttons?.accept?.color || '#ffffff',
              borderRadius: 
                customization.buttons?.accept?.shape === 'rounded' ? '0.375rem' : 
                customization.buttons?.accept?.shape === 'pill' ? '9999px' : '0'
            }}
          >
            Accept
          </button>
          
          <button
            className="py-2 px-4 flex items-center gap-1"
            style={{
              backgroundColor: customization.buttons?.decline?.background || '#f44336',
              color: customization.buttons?.decline?.color || '#ffffff',
              borderRadius: 
                customization.buttons?.decline?.shape === 'rounded' ? '0.375rem' : 
                customization.buttons?.decline?.shape === 'pill' ? '9999px' : '0'
            }}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default ButtonsTabContent;
