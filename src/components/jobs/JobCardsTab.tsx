
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText } from 'lucide-react';

export const JobCardsTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Job Cards</h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Job Card
        </Button>
      </div>
      
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Job Cards</h3>
                <p className="text-sm text-muted-foreground">
                  Create and manage job cards for your business
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Example Job Card {index}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is an example job card that would normally display job card details.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-0">
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
