
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const JobsTab = () => {
  return (
    <Card className="border-dashed border-2 bg-muted/50">
      <CardContent className="py-12 flex flex-col items-center justify-center text-center">
        <h3 className="text-lg font-semibold mb-2">Jobs Management Coming Soon</h3>
        <p className="text-muted-foreground mb-4">
          This feature will be available in the next update
        </p>
      </CardContent>
    </Card>
  );
};
