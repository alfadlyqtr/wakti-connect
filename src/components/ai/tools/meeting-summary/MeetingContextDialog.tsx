
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export interface MeetingContextData {
  title?: string;
  location?: string;
  host?: string;
  participants?: string[];
}

interface MeetingContextDialogProps {
  open: boolean;
  onClose: (data?: MeetingContextData) => void;
  initialData?: MeetingContextData;
}

export const MeetingContextDialog: React.FC<MeetingContextDialogProps> = ({ 
  open, 
  onClose,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<MeetingContextData>({
    title: initialData.title || '',
    location: initialData.location || '',
    host: initialData.host || '',
    participants: initialData.participants || []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'participants') {
      // Convert comma-separated string to array
      setFormData({
        ...formData,
        participants: value.split(',').map(p => p.trim()).filter(p => p)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose(formData);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Meeting Context</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-200 p-3 rounded-md text-sm">
            Don't feel like filling this up? No problem! I'm a smart AI, I can detect the context myself from your recording!
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Weekly Team Sync"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Conference Room B"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="host">Host</Label>
            <Input
              id="host"
              name="host"
              placeholder="Jane Doe"
              value={formData.host}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="participants">Participants (comma-separated)</Label>
            <Input
              id="participants"
              name="participants"
              placeholder="John, Sarah, Ahmed"
              value={formData.participants?.join(', ')}
              onChange={handleChange}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onClose()}>
              Skip
            </Button>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
