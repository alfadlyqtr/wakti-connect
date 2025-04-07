
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { getInvitationCustomization, saveInvitationCustomization } from '@/services/invitation';
import { InvitationCustomization } from '@/types/invitation.types';
import { supabase } from '@/integrations/supabase/client';

export const useInvitationBuilder = (eventId?: string, invitationId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customization, setCustomization] = useState<InvitationCustomization>({
    backgroundType: 'solid',
    backgroundValue: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    fontSize: 'medium',
    textColor: '#000000',
    textAlign: 'left',
    buttonStyles: { style: 'rounded', color: '#3B82F6' },
    layoutSize: 'medium',
    customEffects: {}
  });
  
  const navigate = useNavigate();
  
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      eventDate: undefined,
      eventLocation: '',
      isAllDay: false,
      startTime: '09:00',
      endTime: '10:00',
    }
  });
  
  const loadInvitation = useCallback(async () => {
    if (!invitationId) return;
    
    setIsLoading(true);
    try {
      const { data: invitationData, error: invitationError } = await supabase
        .from('event_invitations')
        .select('*, event:event_id(*)')
        .eq('id', invitationId)
        .single();
      
      if (invitationError) {
        throw invitationError;
      }
      
      if (!invitationData) {
        throw new Error('Invitation not found');
      }
      
      const event = invitationData.event;
      if (event) {
        form.reset({
          title: event.title || '',
          description: event.description || '',
          eventDate: event.start_time ? new Date(event.start_time) : undefined,
          eventLocation: event.location || '',
          isAllDay: event.is_all_day || false,
          startTime: event.start_time ? new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '09:00',
          endTime: event.end_time ? new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '10:00',
        });
      }
      
      const customizationData = await getInvitationCustomization(invitationId);
      if (customizationData) {
        setCustomization(customizationData);
      }
    } catch (error) {
      console.error('Error loading invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to load invitation data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [invitationId, form]);
  
  const saveCustomization = useCallback(async () => {
    if (!invitationId) return;
    
    setIsLoading(true);
    try {
      const savedCustomization = await saveInvitationCustomization(invitationId, customization);
      
      if (typeof savedCustomization === 'object') {
        setCustomization(savedCustomization as InvitationCustomization);
        toast({
          title: 'Success',
          description: 'Invitation customization saved',
        });
      }
    } catch (error) {
      console.error('Error saving customization:', error);
      toast({
        title: 'Error',
        description: 'Failed to save customization',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [invitationId, customization]);
  
  const handleSubmit = useCallback(async (data) => {
    setIsLoading(true);
    try {
      toast({
        title: 'Success',
        description: 'Invitation created successfully',
      });
      
      navigate('/dashboard/events');
    } catch (error) {
      console.error('Error creating invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create invitation',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);
  
  return {
    form,
    customization,
    setCustomization,
    isLoading,
    loadInvitation,
    saveCustomization,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
};
