
import { createClient } from '@supabase/supabase-js';

// Get environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sqdjqehcxpzsudhzjwbu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZGpxZWhjeHB6c3VkaHpqd2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNjYxNzMsImV4cCI6MjA1NzY0MjE3M30.1YAc8f2wgeMWN-UgoH8tL14aiYme6aTewmWPgfC7j_M';

// Check if the Supabase URL is available
if (!supabaseUrl) {
  console.error('Supabase URL is required. Using fallback URL.');
}

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
