
export type FeatureLockStatus = 'locked' | 'unlocked';

export interface FeatureLock {
  id: string;
  feature_name: string;
  status: FeatureLockStatus;
  locked_at: string | null;
  locked_by: string | null;
}

export interface LockAudit {
  id: string;
  feature_name: string;
  action: string;
  success: boolean;
  created_at: string;
}
