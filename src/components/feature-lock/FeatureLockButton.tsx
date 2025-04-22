
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Loader2 } from 'lucide-react';
import { useFeatureLock } from '@/hooks/useFeatureLock';
import { FeatureLockDialog } from './FeatureLockDialog';

interface FeatureLockButtonProps {
  featureName: string;
  className?: string;
}

export const FeatureLockButton: React.FC<FeatureLockButtonProps> = ({
  featureName,
  className
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isLocked, isChecking, checkLockStatus, lockFeature, unlockFeature } = useFeatureLock(featureName);

  useEffect(() => {
    checkLockStatus();
  }, []);

  if (isChecking) {
    return (
      <Button variant="outline" size="sm" disabled className={className}>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  return (
    <>
      <Button
        variant={isLocked ? "destructive" : "outline"}
        size="sm"
        onClick={() => setIsDialogOpen(true)}
        className={className}
      >
        {isLocked ? (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Locked
          </>
        ) : (
          <>
            <Unlock className="h-4 w-4 mr-2" />
            Unlocked
          </>
        )}
      </Button>

      <FeatureLockDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={isLocked ? unlockFeature : lockFeature}
        action={isLocked ? 'unlock' : 'lock'}
        featureName={featureName}
      />
    </>
  );
};
