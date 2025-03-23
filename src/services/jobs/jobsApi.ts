
import { supabase } from "@/integrations/supabase/client";
import { Job, JobFormData } from "@/types/job.types";

/**
 * Fetch all jobs for the current business
 */
export const fetchJobs = async (): Promise<Job[]> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw new Error(`Error fetching jobs: ${error.message}`);
  return data;
};

/**
 * Create a new job
 */
export const createJob = async (jobData: JobFormData): Promise<Job> => {
  // Get the current user (business)
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("User not authenticated");
  }
  
  const { data, error } = await supabase
    .from('jobs')
    .insert([{
      ...jobData,
      business_id: userData.user.id
    }])
    .select()
    .single();
    
  if (error) throw new Error(`Error creating job: ${error.message}`);
  return data;
};

/**
 * Update an existing job
 */
export const updateJob = async (id: string, jobData: Partial<JobFormData>): Promise<Job> => {
  const { data, error } = await supabase
    .from('jobs')
    .update(jobData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw new Error(`Error updating job: ${error.message}`);
  return data;
};

/**
 * Delete a job
 */
export const deleteJob = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id);
    
  if (error) throw new Error(`Error deleting job: ${error.message}`);
};

/**
 * Fetch jobs for a staff member's business 
 */
export const fetchBusinessJobs = async (): Promise<Job[]> => {
  const { data, error } = await supabase.from('jobs').select('*');
  
  if (error) throw new Error(`Error fetching business jobs: ${error.message}`);
  return data || [];
};
