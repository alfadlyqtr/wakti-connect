
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, RefreshCw, Smartphone, Monitor, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PagePreviewTabProps {
  getPublicPageUrl: () => string;
}

const PagePreviewTab: React.FC<PagePreviewTabProps> = ({ getPublicPageUrl }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  
  // Calculate preview URL with timestamp to force refresh when needed
  useEffect(() => {
    updatePreviewUrl();
  }, [getPublicPageUrl]);
  
  const updatePreviewUrl = () => {
    const baseUrl = getPublicPageUrl();
    const timestamp = new Date().getTime();
    
    if (baseUrl === '#') {
      console.error("Invalid page slug, cannot generate preview URL");
      setLoadError(true);
      return;
    }
    
    // Make sure we're always accessing the business page with the preview flag
    const url = baseUrl.includes('?') 
      ? `${baseUrl}&preview=true&t=${timestamp}` 
      : `${baseUrl}?preview=true&t=${timestamp}`;
    
    console.log("Preview URL generated:", url);
    setPreviewUrl(url);
    setLoadError(false);
    setIsLoading(true);
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true);
    updatePreviewUrl();
    
    // Visual feedback for refresh operation
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // iPhone 14 dimensions (approximate)
  const mobileWidth = viewMode === 'mobile' ? '390px' : '100%';
  const mobileHeight = '844px';
  
  // Handle iframe load events
  const handleIframeLoad = () => {
    console.log("Preview iframe loaded successfully");
    setIsLoading(false);
  };
  
  const handleIframeError = () => {
    console.error("Failed to load preview iframe");
    setLoadError(true);
    setIsLoading(false);
    toast({
      variant: "destructive",
      title: "Preview failed to load",
      description: "Could not load the page preview. Please check your page settings."
    });
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
              <Monitor className="h-4 w-4" />
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
            className={`border rounded-lg overflow-hidden transition-all duration-300`}
            style={{ 
              width: mobileWidth,
              maxWidth: '100%'
            }}
          >
            {previewUrl && !loadError ? (
              <>
                {isLoading && (
                  <div className="flex items-center justify-center bg-muted h-[300px]">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                )}
                <iframe
                  src={previewUrl}
                  style={{
                    width: '100%',
                    height: mobileHeight,
                    maxHeight: 'calc(100vh - 300px)',
                    display: isLoading ? 'none' : 'block'
                  }}
                  title="Page Preview"
                  key={previewUrl} // Force iframe reload when URL changes
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  sandbox="allow-same-origin allow-scripts allow-forms"
                  loading="lazy"
                  referrerPolicy="same-origin"
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center bg-muted/30 h-[300px] p-6 text-center">
                <AlertCircle className="h-10 w-10 mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {previewUrl === '#' ? 
                    "Please set a page slug in the settings to enable preview." :
                    "Preview could not be loaded. Please check your page settings and network connection."
                  }
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleRefresh}
                >
                  Try again
                </Button>
              </div>
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
          disabled={getPublicPageUrl() === '#'}
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
