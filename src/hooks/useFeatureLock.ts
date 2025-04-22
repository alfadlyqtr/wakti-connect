
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { FeatureLock, FeatureLockStatus } from '@/types/feature-lock';

export const useFeatureLock = (featureName: string) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isLocked, setIsLocked] = useState<boolean | null>(null);

  const checkLockStatus = async () => {
    try {
      setIsChecking(true);
      const { data, error } = await supabase
        .rpc('is_feature_locked', { feature_name_param: featureName });

      if (error) throw error;
      setIsLocked(data);
      return data;
    } catch (error) {
      console.error('Error checking lock status:', error);
      toast.error('Failed to check feature lock status');
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const lockFeature = async (password: string) => {
    try {
      setIsChecking(true);
      const { data, error } = await supabase
        .rpc('lock_feature', { 
          feature_name_param: featureName,
          password_attempt: password 
        });

      if (error) throw error;
      if (data) {
        setIsLocked(true);
        toast.success('Feature locked successfully');
      } else {
        toast.error('Invalid password');
      }
      return data;
    } catch (error) {
      console.error('Error locking feature:', error);
      toast.error('Failed to lock feature');
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const unlockFeature = async (password: string) => {
    try {
      setIsChecking(true);
      const { data, error } = await supabase
        .rpc('unlock_feature', { 
          feature_name_param: featureName,
          password_attempt: password 
        });

      if (error) throw error;
      if (data) {
        setIsLocked(false);
        toast.success('Feature unlocked successfully');
      } else {
        toast.error('Invalid password');
      }
      return data;
    } catch (error) {
      console.error('Error unlocking feature:', error);
      toast.error('Failed to unlock feature');
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    isLocked,
    isChecking,
    checkLockStatus,
    lockFeature,
    unlockFeature
  };
};
