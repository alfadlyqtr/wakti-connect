
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/auth/useUser';
import { useBusinessPageDataQuery } from '@/hooks/business-page/useBusinessPageDataQueries';
import { useCreateBusinessPageDataMutation } from '@/hooks/business-page/useBusinessPageDataMutations';
import { toast } from '@/components/ui/use-toast';
import SimpleBusinessPageBuilder from '../SimpleBusinessPageBuilder';

const Builder: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: pageData, isLoading, error } = useBusinessPageDataQuery(user?.id);
  const createPageMutation = useCreateBusinessPageDataMutation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-red-600">Error</h2>
              <p className="mt-2 text-gray-600">Failed to load page data. Please try again later.</p>
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="mt-4"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <SimpleBusinessPageBuilder />;
};

export default Builder;
