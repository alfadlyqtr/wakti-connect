
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";

interface NonWaktiUserPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  type: 'accepted' | 'declined';
  eventTitle: string;
  isSubmitting?: boolean;
}

const NonWaktiUserPopup: React.FC<NonWaktiUserPopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  eventTitle,
  isSubmitting = false
}) => {
  const [name, setName] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSubmit(name.trim());
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isSubmitting) onClose();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'accepted' ? (
              <>
                <Check className="h-5 w-5 text-green-600" />
                You're attending!
              </>
            ) : (
              <>
                <X className="h-5 w-5 text-red-600" />
                Not attending
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {type === 'accepted' 
              ? `Thank you for accepting "${eventTitle}". Please provide your name.` 
              : `Please provide your name to decline "${eventTitle}".`}
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
                className="col-span-3"
                autoFocus
                required
                placeholder="Enter your name"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={onClose} 
              type="button"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !name.trim()}
              variant={type === 'accepted' ? "success" : "destructive"}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Response'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NonWaktiUserPopup;
