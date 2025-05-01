
import React from 'react';
import { SimpleInvitation, SimpleInvitationCustomization } from '@/types/invitation.types';
import InvitationForm from './InvitationForm';
import InvitationPreview from './InvitationPreview';
import { Button } from '@/components/ui/button';

interface SimpleCardEditorProps {
  invitation: Partial<SimpleInvitation>;
  onInvitationChange: (invitation: Partial<SimpleInvitation>) => void;
  onCustomizationChange: (customization: SimpleInvitationCustomization) => void;
  onSaveDraft?: () => void;
  onSave: () => void;
  isEvent?: boolean;
}

const SimpleCardEditor: React.FC<SimpleCardEditorProps> = ({
  invitation,
  onInvitationChange,
  onCustomizationChange,
  onSaveDraft,
  onSave,
  isEvent = false
}) => {
  const handleFieldChange = (field: string, value: string) => {
    onInvitationChange({
      ...invitation,
      [field]: value
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <InvitationForm
          formData={{
            title: invitation.title || '',
            description: invitation.description || '',
            date: invitation.date || '',
            time: invitation.time || '',
            location: invitation.location || '',
            locationTitle: invitation.locationTitle || ''
          }}
          onChange={handleFieldChange}
          isEvent={isEvent}
        />
        
        <div className="flex flex-wrap gap-4 mt-6">
          {onSaveDraft && (
            <Button variant="outline" onClick={onSaveDraft}>
              Save Draft
            </Button>
          )}
          <Button onClick={onSave}>
            {isEvent ? 'Create Event' : 'Create Invitation'}
          </Button>
        </div>
      </div>
      
      <div className="bg-background rounded-lg p-4 border">
        <div className="mb-4">
          <h3 className="font-medium text-lg">Preview</h3>
        </div>
        <InvitationPreview
          title={invitation.title}
          description={invitation.description}
          location={invitation.location}
          locationTitle={invitation.locationTitle}
          date={invitation.date}
          time={invitation.time}
          customization={invitation.customization || {
            background: { type: 'solid', value: '#ffffff' },
            font: { family: 'system-ui, sans-serif', size: 'medium', color: '#000000', alignment: 'center' },
            textLayout: { contentPosition: 'middle', spacing: 'normal' }
          }}
          isEvent={isEvent}
          showActions={false}
        />
      </div>
    </div>
  );
};

export default SimpleCardEditor;
