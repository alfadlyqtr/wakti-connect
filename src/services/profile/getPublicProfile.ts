
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type PublicBusinessProfile = Tables<"profiles"> & {
  booking_templates?: {
    id: string;
    name: string;
    description: string | null;
    duration: number;
    price: number | null;
  }[];
};

export const getPublicProfileBySlug = async (slug: string): Promise<PublicBusinessProfile | null> => {
  try {
    // First get the profile with the matching slug
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', slug)
      .eq('account_type', 'business')
      .eq('is_active', true)
      .single();
      
    if (error || !profile) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    // Get booking templates for this business
    const { data: bookingTemplates } = await supabase
      .from('booking_templates')
      .select('id, name, description, duration, price')
      .eq('business_id', profile.id)
      .eq('is_published', true);
      
    return {
      ...profile,
      booking_templates: bookingTemplates || []
    };
  } catch (error) {
    console.error('Error in getPublicProfileBySlug:', error);
    return null;
  }
};
