
import React from 'react';
import { useParams } from 'react-router-dom';
import SharedInvitationView from '@/components/invitations/SharedInvitationView';

const SharedEventPage = () => {
  const { id, shareId } = useParams<{ id?: string, shareId?: string }>();
  
  console.log("SharedEventPage: Rendering with params:", { id, shareId });
  
  // Determine which ID to use (id from /e/:id or shareId from /i/:shareId)
  const effectiveShareId = shareId || id;
  
  return <SharedInvitationView />;
};

export default SharedEventPage;
