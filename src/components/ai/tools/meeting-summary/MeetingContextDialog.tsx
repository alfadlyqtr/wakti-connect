
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Users, User, Info } from 'lucide-react';

export interface MeetingContextData {
  location: string;
  participants: string;
  host: string;
}

interface MeetingContextDialogProps {
  open: boolean;
  onClose: (data?: MeetingContextData) => void;
}

export const MeetingContextDialog: React.FC<MeetingContextDialogProps> = ({
  open,
  onClose
}) => {
  const [contextData, setContextData] = useState<MeetingContextData>({
    location: '',
    participants: '',
    host: ''
  });

  const handleInputChange = (field: keyof MeetingContextData, value: string) => {
    setContextData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onClose(contextData);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleSkip()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Meeting Context</DialogTitle>
          <DialogDescription className="text-center">
            Provide optional details to improve your meeting summary
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" /> Location
            </Label>
            <Input
              id="location"
              placeholder="Main Conference Room"
              value={contextData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="participants" className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" /> Participants
            </Label>
            <Input
              id="participants"
              placeholder="John, Sarah, Michael"
              value={contextData.participants}
              onChange={(e) => handleInputChange('participants', e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="host" className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" /> Host
            </Label>
            <Input
              id="host"
              placeholder="Team Lead"
              value={contextData.host}
              onChange={(e) => handleInputChange('host', e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
            <Info className="h-4 w-4" />
            <p>Entering details helps create a better summary, but we'll try to detect them from the conversation if skipped.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 mt-2">
          <Button 
            variant="outline" 
            className="sm:flex-1" 
            onClick={handleSkip}
          >
            Skip and Start Recording
          </Button>
          <Button 
            variant="default"
            className="sm:flex-1"
            onClick={handleSubmit}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
