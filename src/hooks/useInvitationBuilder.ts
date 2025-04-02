
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  getInvitationCustomization,
  updateInvitationCustomization
} from '@/services/invitation';
import { InvitationTemplate, InvitationCustomization, InvitationStyle } from '@/types/invitation.types';

export const useInvitationBuilder = (invitationId?: string) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<InvitationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customization, setCustomization] = useState<InvitationCustomization>({
    background: {
      type: 'color',
      value: '#ffffff'
    },
    font: {
      family: 'system-ui, sans-serif',
      size: 'medium',
      color: '#333333',
      alignment: 'left'
    },
    buttons: {
      accept: {
        background: '#4CAF50',
        color: '#ffffff',
        shape: 'rounded'
      },
      decline: {
        background: '#f44336',
        color: '#ffffff',
        shape: 'rounded'
      }
    },
    headerStyle: 'simple',
    animation: 'fade'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Load available templates
  useEffect(() => {
    // Load templates logic
    const loadTemplates = async () => {
      // Normally you would fetch templates from API
      setTemplates([
        {
          id: 'template1',
          name: 'Basic',
          previewImage: '/templates/basic.jpg',
          defaultStyles: {
            background: { type: 'color', value: '#ffffff' },
            font: { family: 'system-ui, sans-serif', size: 'medium', color: '#333333' },
            buttons: {
              accept: { background: '#4CAF50', color: '#ffffff', shape: 'rounded' },
              decline: { background: '#f44336', color: '#ffffff', shape: 'rounded' }
            }
          },
          createdAt: new Date().toISOString()
        },
        {
          id: 'template2',
          name: 'Professional',
          previewImage: '/templates/professional.jpg',
          defaultStyles: {
            background: { type: 'color', value: '#f8f9fa' },
            font: { family: 'Georgia, serif', size: 'medium', color: '#212529' },
            buttons: {
              accept: { background: '#343a40', color: '#ffffff', shape: 'rounded' },
              decline: { background: '#6c757d', color: '#ffffff', shape: 'rounded' }
            }
          },
          createdAt: new Date().toISOString()
        }
      ]);
    };
    
    loadTemplates();
  }, []);
  
  // Load customization settings if invitationId is provided
  useEffect(() => {
    if (!invitationId) return;
    
    const loadCustomization = async () => {
      setIsLoading(true);
      try {
        const data = await getInvitationCustomization(invitationId);
        if (data) {
          setCustomization(data);
        }
      } catch (error) {
        console.error('Error loading invitation customization:', error);
        toast({
          title: 'Error',
          description: 'Could not load invitation customization settings',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCustomization();
  }, [invitationId, toast]);
  
  // Handle selecting a template
  const selectTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      // Here you would transform template.defaultStyles into InvitationCustomization format
      // This is just a simplified example
      setCustomization(prev => ({
        ...prev,
        background: template.defaultStyles.background,
        font: template.defaultStyles.font,
        buttons: template.defaultStyles.buttons
      }));
    }
  }, [templates]);
  
  // Handle updating customization
  const updateCustomization = useCallback((newCustomization: Partial<InvitationCustomization>) => {
    setCustomization(prev => ({
      ...prev,
      ...newCustomization
    }));
  }, []);
  
  // Save customization changes
  const saveCustomization = useCallback(async () => {
    if (!invitationId || !user) {
      toast({
        title: 'Error',
        description: 'Missing invitation ID or user not logged in',
        variant: 'destructive'
      });
      return { success: false };
    }
    
    setIsSaving(true);
    try {
      const result = await updateInvitationCustomization(invitationId, customization);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Invitation customization saved successfully'
        });
        return { success: true };
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Could not save invitation customization',
          variant: 'destructive'
        });
        return { success: false };
      }
    } catch (error) {
      console.error('Error saving invitation customization:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while saving customization',
        variant: 'destructive'
      });
      return { success: false };
    } finally {
      setIsSaving(false);
    }
  }, [invitationId, user, customization, toast]);
  
  return {
    templates,
    selectedTemplate,
    customization,
    isLoading,
    isSaving,
    selectTemplate,
    updateCustomization,
    saveCustomization
  };
};
