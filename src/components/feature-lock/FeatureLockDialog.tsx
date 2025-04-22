
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Unlock } from 'lucide-react';

interface FeatureLockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<boolean>;
  action: 'lock' | 'unlock';
  featureName: string;
}

export const FeatureLockDialog: React.FC<FeatureLockDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  featureName
}) => {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await onConfirm(password);
    if (success) {
      setPassword('');
      onClose();
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {action === 'lock' ? (
              <Lock className="h-5 w-5" />
            ) : (
              <Unlock className="h-5 w-5" />
            )}
            {action === 'lock' ? 'Lock Feature' : 'Unlock Feature'}
          </DialogTitle>
          <DialogDescription>
            Enter the master password to {action} {featureName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter master password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant={action === 'lock' ? 'destructive' : 'default'}
              disabled={isSubmitting}
            >
              {action === 'lock' ? 'Lock' : 'Unlock'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
