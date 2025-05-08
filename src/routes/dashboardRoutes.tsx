
import React from 'react';
import SimpleInvitationsList from '@/components/invitations/SimpleInvitationsList';
import SimpleInvitationCreator from '@/components/invitations/SimpleInvitationCreator';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSimpleInvitationById } from '@/services/invitation/simple-invitations';
import BusinessPageBuilder from '@/components/business/page-builder/BusinessPageBuilder';

const InvitationEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { data: invitation, isLoading, error } = useQuery({
    queryKey: ['invitation', id],
    queryFn: () => id ? getSimpleInvitationById(id) : Promise.resolve(null),
    enabled: !!id
  });

  if (isLoading) {
    return <div className="p-8 text-center">Loading invitation...</div>;
  }

  if (error || !invitation) {
    return <div className="p-8 text-center">Could not load invitation. It may have been deleted.</div>;
  }

  return <SimpleInvitationCreator existingInvitation={invitation} />;
};

export const dashboardRoutes = [
  {
    path: "invitations",
    element: <SimpleInvitationsList />,
  },
  {
    path: "invitations/new",
    element: <SimpleInvitationCreator />,
  },
  {
    path: "invitations/edit/:id",
    element: <InvitationEdit />,
  },
  {
    path: "events",
    element: <SimpleInvitationsList isEventsList={true} />,
  },
  {
    path: "events/new",
    element: <SimpleInvitationCreator isEvent={true} />,
  },
  {
    path: "events/edit/:id",
    element: <InvitationEdit />,
  },
  {
    path: "business-page",
    element: <BusinessPageBuilder />,
  },
];

export default dashboardRoutes;
