
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePublicBusinessProfile } from '@/hooks/usePublicBusinessProfile';
import BusinessProfileView from '@/components/business-profile/BusinessProfileView';
import { Helmet } from 'react-helmet-async';

const BusinessProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { profile, isLoading, error } = usePublicBusinessProfile(slug);

  useEffect(() => {
    if (error) {
      navigate('/not-found', { replace: true });
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="h-8 w-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <Helmet>
        <title>{profile.business_name || 'Business Profile'}</title>
        <meta name="description" content={profile.business_address || `Business profile for ${profile.business_name}`} />
        <meta property="og:title" content={profile.business_name || 'Business Profile'} />
        <meta property="og:description" content={profile.business_address || `Business profile for ${profile.business_name}`} />
        <meta property="og:type" content="website" />
        {profile.avatar_url && <meta property="og:image" content={profile.avatar_url} />}
      </Helmet>
      <BusinessProfileView profile={profile} />
    </>
  );
};

export default BusinessProfilePage;
