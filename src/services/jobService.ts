
import { supabase } from "@/integrations/supabase/client";
import { Job, JobCard, JobFormData, JobCardFormData } from "@/types/job.types";

// Jobs API
export const fetchJobs = async (): Promise<Job[]> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw new Error(`Error fetching jobs: ${error.message}`);
  return data;
};

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

export const deleteJob = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id);
    
  if (error) throw new Error(`Error deleting job: ${error.message}`);
};

// Job Cards API
export const fetchJobCards = async (staffRelationId?: string): Promise<JobCard[]> => {
  let query = supabase
    .from('job_cards')
    .select(`
      *,
      jobs:job_id (
        id,
        name,
        description,
        duration,
        default_price
      )
    `);
    
  if (staffRelationId) {
    query = query.eq('staff_relation_id', staffRelationId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
    
  if (error) throw new Error(`Error fetching job cards: ${error.message}`);
  return data;
};

export const createJobCard = async (
  staffRelationId: string, 
  jobCardData: JobCardFormData
): Promise<JobCard> => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('job_cards')
    .insert([{
      staff_relation_id: staffRelationId,
      job_id: jobCardData.job_id,
      start_time: now,
      payment_method: jobCardData.payment_method,
      payment_amount: jobCardData.payment_amount,
      notes: jobCardData.notes
    }])
    .select(`
      *,
      jobs:job_id (
        id,
        name,
        description,
        duration,
        default_price
      )
    `)
    .single();
    
  if (error) throw new Error(`Error creating job card: ${error.message}`);
  return data;
};

export const completeJobCard = async (jobCardId: string): Promise<JobCard> => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('job_cards')
    .update({ end_time: now })
    .eq('id', jobCardId)
    .select(`
      *,
      jobs:job_id (
        id,
        name,
        description,
        duration,
        default_price
      )
    `)
    .single();
    
  if (error) throw new Error(`Error completing job card: ${error.message}`);
  return data;
};

// Fetch business jobs from jobs table for a staff member
export const fetchBusinessJobs = async (): Promise<Job[]> => {
  const { data, error } = await supabase.from('jobs').select('*');
  
  if (error) throw new Error(`Error fetching business jobs: ${error.message}`);
  return data || [];
};

// Staff work session management
export const fetchActiveWorkSession = async (staffRelationId: string) => {
  const { data, error } = await supabase
    .from('staff_work_logs')
    .select('*')
    .eq('staff_relation_id', staffRelationId)
    .eq('status', 'active')
    .maybeSingle();
  
  if (error) throw new Error(`Error fetching active work session: ${error.message}`);
  return data;
};

export const startWorkSession = async (staffRelationId: string) => {
  const { data, error } = await supabase
    .from('staff_work_logs')
    .insert({
      staff_relation_id: staffRelationId,
      start_time: new Date().toISOString(),
      status: 'active'
    })
    .select()
    .single();
    
  if (error) throw new Error(`Error starting work session: ${error.message}`);
  return data;
};

export const endWorkSession = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('staff_work_logs')
    .update({
      end_time: new Date().toISOString(),
      status: 'completed'
    })
    .eq('id', sessionId)
    .select()
    .single();
    
  if (error) throw new Error(`Error ending work session: ${error.message}`);
  return data;
};

// Fetch staff work history
export const fetchWorkHistory = async (staffRelationId: string) => {
  const { data, error } = await supabase
    .from('staff_work_logs')
    .select('*')
    .eq('staff_relation_id', staffRelationId)
    .order('created_at', { ascending: false });
  
  if (error) throw new Error(`Error fetching work history: ${error.message}`);
  return data;
};

// Utility to check if user is a staff member
export const fetchStaffRelation = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('business_staff')
    .select('id, business_id')
    .eq('staff_id', user.id)
    .eq('status', 'active')
    .maybeSingle();
  
  if (error) throw new Error(`Error fetching staff relation: ${error.message}`);
  return data;
};
