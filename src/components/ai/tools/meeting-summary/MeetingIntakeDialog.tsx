
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MeetingIntakeForm from './MeetingIntakeForm';
import { IntakeData } from '@/hooks/ai/meeting-summary/types';

interface MeetingIntakeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IntakeData) => void;
  onSkip: () => void;
}

export const MeetingIntakeDialog: React.FC<MeetingIntakeDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSkip
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-panel transform-3d-hover sm:max-w-[600px] border-none bg-gradient-to-br from-blue-600/30 to-purple-600/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Meeting Details</DialogTitle>
        </DialogHeader>
        <MeetingIntakeForm onSubmit={onSubmit} onSkip={onSkip} />
      </DialogContent>
    </Dialog>
  );
};
