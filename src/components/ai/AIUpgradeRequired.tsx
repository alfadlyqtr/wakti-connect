
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AIUpgradeRequired: React.FC = () => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
          Premium Feature
        </CardTitle>
        <CardDescription>
          This feature requires a paid plan
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm pb-2">
        <p>Upgrade your account to access AI features and more advanced tools</p>
      </CardContent>
      <CardFooter>
        <Button asChild size="sm" className="w-full">
          <Link to="/dashboard/settings">
            Upgrade Now
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIUpgradeRequired;
