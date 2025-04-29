
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NonWaktiUserPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  type: 'accept' | 'decline';
  eventTitle: string;
}

const NonWaktiUserPopup: React.FC<NonWaktiUserPopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  eventTitle
}) => {
  const [name, setName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'accept' ? 'You\'ve accepted this event!' : 'You\'ve declined this event'}
          </DialogTitle>
          <DialogDescription>
            Please provide your name so the organizer knows who responded
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Your Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="col-span-3"
                required
              />
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-md mb-4">
            <h4 className="text-sm font-medium mb-2">Enhance Your Experience with WAKTI</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Create a free WAKTI account to manage all your events in one place, get reminders, and more.
            </p>
            <Button 
              type="button" 
              variant="outline"
              className="w-full"
              onClick={() => window.open('https://wakti.qa', '_blank')}
            >
              Visit WAKTI.qa
            </Button>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{type === 'accept' ? 'Confirm' : 'Submit'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NonWaktiUserPopup;
