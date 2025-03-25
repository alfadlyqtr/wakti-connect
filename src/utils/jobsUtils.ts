
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/jobs.types';

/**
 * Checks if a job is being used in any active job card
 * Only active job cards (where end_time is null) should prevent edits
 */
export const isJobInUse = async (jobId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('job_cards')
    .select('id')
    .eq('job_id', jobId)
    .is('end_time', null) // Only consider active job cards (end_time is null)
    .limit(1);
    
  if (error) {
    console.error('Error checking if job is in use:', error);
    return false;
  }
  
  return data && data.length > 0;
};

/**
 * Checks if the user is a business owner
 * Business owners don't need to clock in to create job cards
 */
export const isBusinessOwner = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;
    
    // Get user role from profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .single();
      
    if (error) {
      console.error('Error checking user role:', error);
      return false;
    }
    
    return data?.account_type === 'business';
  } catch (error) {
    console.error('Error in isBusinessOwner:', error);
    return false;
  }
};

/**
 * Get jobs that are not used in any active job cards
 * These are the only jobs that can be safely edited or deleted
 */
export const getEditableJobs = async (): Promise<Job[]> => {
  try {
    // First get all jobs
    const { data: allJobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*');
      
    if (jobsError) throw jobsError;
    if (!allJobs) return [];
    
    // Then get all job IDs that are used in active job cards (where end_time is null)
    const { data: activeJobCards, error: cardsError } = await supabase
      .from('job_cards')
      .select('job_id')
      .is('end_time', null);
      
    if (cardsError) throw cardsError;
    
    // Filter out jobs that are used in active job cards
    const activeJobIds = activeJobCards ? activeJobCards.map(card => card.job_id) : [];
    return allJobs.filter(job => !activeJobIds.includes(job.id));
  } catch (error) {
    console.error('Error getting editable jobs:', error);
    return [];
  }
};
