
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, RefreshCw, Smartphone, Desktop } from "lucide-react";

interface PagePreviewTabProps {
  getPublicPageUrl: () => string;
}

const PagePreviewTab: React.FC<PagePreviewTabProps> = ({ getPublicPageUrl }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Calculate preview URL with timestamp to force refresh when needed
  useEffect(() => {
    updatePreviewUrl();
  }, [getPublicPageUrl]);
  
  const updatePreviewUrl = () => {
    const baseUrl = getPublicPageUrl();
    const timestamp = new Date().getTime();
    const url = baseUrl.includes('?') 
      ? `${baseUrl}&preview=true&t=${timestamp}` 
      : `${baseUrl}?preview=true&t=${timestamp}`;
    setPreviewUrl(url);
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    updatePreviewUrl();
    
    // Visual feedback for refresh operation
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Page Preview</CardTitle>
            <CardDescription>
              Preview how your landing page will appear to visitors
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'mobile' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('mobile')}
              title="Mobile view"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'desktop' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('desktop')}
              title="Desktop view"
            >
              <Desktop className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh preview"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="flex justify-center">
          <div 
            className={`border rounded-lg overflow-hidden transition-all duration-300 ${
              viewMode === 'mobile' ? 'w-[375px]' : 'w-full'
            }`}
          >
            {previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full h-[600px]"
                title="Page Preview"
              />
            )}
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
          <a href={previewUrl} target="_blank" rel="noopener noreferrer">
            <Globe className="h-4 w-4 mr-2" />
            View Full Page
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PagePreviewTab;
