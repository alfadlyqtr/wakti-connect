
import { createClient } from '@supabase/supabase-js';

// Get environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if the Supabase URL is available
if (!supabaseUrl) {
  console.error('Supabase URL is required. Please add VITE_SUPABASE_URL to your environment variables.');
}

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
