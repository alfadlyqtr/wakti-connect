
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Settings } from "lucide-react";

export const JobsTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Jobs Management</h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add New Job
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Example Job {index}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is an example job that would normally display job details.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-0">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Manage
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
