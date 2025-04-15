
import { createClient } from '@supabase/supabase-js';

// DEPRECATION NOTICE: This file is deprecated and should not be used.
// Please use '@/integrations/supabase/client' instead.
console.warn('DEPRECATED: src/lib/supabase.ts is deprecated. Use @/integrations/supabase/client.ts instead.');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please use @/integrations/supabase/client instead.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
