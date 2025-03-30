
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Store, Home } from 'lucide-react';

const BusinessPageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <Store className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Business Page Not Found</h1>
        <p className="mb-6 text-muted-foreground">
          The business page you're looking for doesn't exist or may have been removed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link to="/search">
              <Store className="mr-2 h-4 w-4" />
              Browse Businesses
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessPageNotFound;
