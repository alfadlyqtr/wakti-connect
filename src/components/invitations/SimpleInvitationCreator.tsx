
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { SimpleInvitation, SimpleInvitationCustomization, BackgroundType } from '@/types/invitation.types';
import { createSimpleInvitation, updateSimpleInvitation } from '@/services/invitation/simple-invitations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvitationForm from './InvitationForm';
import InvitationStyler from './InvitationStyler';
import InvitationPreview from './InvitationPreview';
import { toast } from '@/components/ui/use-toast';

interface SimpleInvitationCreatorProps {
  existingInvitation?: SimpleInvitation;
  onSuccess?: () => void;
}

export default function SimpleInvitationCreator({ existingInvitation, onSuccess }: SimpleInvitationCreatorProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: existingInvitation?.title || '',
    description: existingInvitation?.description || '',
    location: existingInvitation?.location || '',
    locationTitle: existingInvitation?.locationTitle || '',
    date: existingInvitation?.date || '',
    time: existingInvitation?.time || '',
  });

  const [customization, setCustomization] = useState<SimpleInvitationCustomization>(
    existingInvitation?.customization || {
      background: {
        type: 'solid' as BackgroundType,
        value: '#ffffff',
      },
      font: {
        family: 'system-ui, sans-serif',
        size: 'medium',
        color: '#000000',
        alignment: 'left',
      },
    }
  );

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomizationChange = (newCustomization: SimpleInvitationCustomization) => {
    setCustomization(newCustomization);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const invitationData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        locationTitle: formData.locationTitle,
        date: formData.date,
        time: formData.time,
        customization,
      };

      let result;
      if (existingInvitation) {
        // Update existing invitation
        result = await updateSimpleInvitation(existingInvitation.id, invitationData);
      } else {
        // Create new invitation
        result = await createSimpleInvitation(invitationData);
      }

      if (result) {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/invitations');
        }
      }
    } catch (error) {
      console.error('Error saving invitation:', error);
      toast({
        title: 'Failed to save invitation',
        description: 'There was an error while saving your invitation.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextTab = () => {
    if (activeTab === 'details') {
      setActiveTab('customize');
    } else if (activeTab === 'customize') {
      handleSubmit();
    }
  };

  const handlePrevTab = () => {
    if (activeTab === 'customize') {
      setActiveTab('details');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {existingInvitation ? 'Edit Invitation' : 'Create New Invitation'}
        </h1>
        <p className="text-muted-foreground">
          {existingInvitation 
            ? 'Update your invitation details and styling' 
            : 'Fill in the details and customize your invitation'}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Invitation Details</TabsTrigger>
          <TabsTrigger value="customize">Customize Style</TabsTrigger>
        </TabsList>

        <Card className="mt-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <TabsContent value="details" className="mt-0">
                <InvitationForm 
                  formData={formData}
                  onChange={handleFormChange}
                />
              </TabsContent>

              <TabsContent value="customize" className="mt-0">
                <InvitationStyler
                  customization={customization}
                  onChange={handleCustomizationChange}
                  title={formData.title}
                  description={formData.description}
                />
              </TabsContent>
            </div>

            <div className="order-first md:order-last mb-6 md:mb-0">
              <div className="sticky top-4">
                <h3 className="text-sm font-medium mb-2 text-muted-foreground">Preview</h3>
                <InvitationPreview
                  title={formData.title}
                  description={formData.description}
                  location={formData.location}
                  locationTitle={formData.locationTitle}
                  date={formData.date}
                  time={formData.time}
                  customization={customization}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => navigate('/invitations')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <div className="flex gap-2">
              {activeTab === 'customize' && (
                <Button variant="outline" onClick={handlePrevTab} disabled={isSubmitting}>
                  Previous
                </Button>
              )}
              <Button onClick={handleNextTab} disabled={isSubmitting}>
                {activeTab === 'details' ? 'Next: Customize' : 'Save Invitation'}
              </Button>
            </div>
          </div>
        </Card>
      </Tabs>
    </div>
  );
}
