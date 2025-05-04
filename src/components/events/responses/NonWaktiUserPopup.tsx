
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
}

const NonWaktiUserPopup: React.FC<NonWaktiUserPopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  eventTitle
}) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(name.trim());
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              ? `Thank you for accepting "${eventTitle}". Please provide your name to be added to the guest list.` 
              : `Please provide your name so the organizer knows you've declined "${eventTitle}".`}
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
              />
            </div>
          </div>
          
          <div className="mt-4 mb-2 p-4 bg-blue-50 rounded-md text-sm">
            <p className="font-medium text-blue-700 mb-1">Get more from WAKTI!</p>
            <p className="text-blue-600">
              Create a free WAKTI account to manage your events, get reminders, and connect with others.
            </p>
            <a 
              href="https://wakti.qa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-800 mt-2 inline-block font-medium"
            >
              Visit wakti.qa →
            </a>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!name.trim() || isSubmitting}
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
