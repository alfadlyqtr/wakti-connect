
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

interface PagePreviewTabProps {
  getPublicPageUrl: () => string;
}

const PagePreviewTab: React.FC<PagePreviewTabProps> = ({ getPublicPageUrl }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Preview</CardTitle>
        <CardDescription>
          Preview how your landing page will appear to visitors
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="flex justify-center">
          <div className="border rounded-lg overflow-hidden w-full">
            <iframe
              src={getPublicPageUrl()}
              className="w-full h-[600px]"
              title="Page Preview"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6 flex justify-between">
        <p className="text-sm text-muted-foreground">
          <strong>Public URL:</strong> {getPublicPageUrl()}
        </p>
        <Button 
          variant="outline" 
          asChild
        >
          <a href={getPublicPageUrl()} target="_blank" rel="noopener noreferrer">
            <Globe className="h-4 w-4 mr-2" />
            View Full Page
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PagePreviewTab;
