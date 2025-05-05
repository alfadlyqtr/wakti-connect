
// DEPRECATION NOTICE: This file is deprecated and should not be used.
// Please use '@/integrations/supabase/client.ts' instead.
console.warn('DEPRECATED: src/lib/supabase.ts is deprecated. Use @/integrations/supabase/client.ts instead.');

import { supabase as correctClient } from '@/integrations/supabase/client';

// Re-export the correct client to avoid breaking existing code
export const supabase = correctClient;
