
import { SimpleInvitation, SimpleInvitationCustomization, BackgroundType } from '@/types/invitation.types';
import { InvitationDbRecord } from './invitation-types';

/**
 * @deprecated - This function is no longer used. Direct mapping with explicit property assignments is used instead.
 * This function has been kept for reference only and should not be used due to
 * TypeScript "excessively deep instantiation" errors when used with complex types.
 */
export function createCustomizationObject(data: InvitationDbRecord): SimpleInvitationCustomization {
  // Always provide default values for all properties to avoid type issues
  return {
    background: {
      type: (data.background_type || 'solid') as BackgroundType,
      value: data.background_value || '#ffffff',
    },
    font: {
      family: data.font_family || 'system-ui, sans-serif',
      size: data.font_size || 'medium',
      color: data.text_color || '#000000',  // Use text_color for font color
      alignment: data.text_align || 'left', 
      weight: 'normal',
    },
  };
}

/**
 * @deprecated - This function is no longer used. Direct mapping with explicit property assignments is used instead.
 * This function has been kept for reference only and should not be used due to
 * TypeScript "excessively deep instantiation" errors when used with complex types.
 */
export function mapDatabaseToSimpleInvitation(data: InvitationDbRecord): SimpleInvitation {
  // This function is deprecated and should not be used.
  // Instead, use direct mapping with explicit property assignments as shown in invitation-api.ts
  throw new Error("This function causes TypeScript instantiation depth errors. Use direct mapping instead.");
}
