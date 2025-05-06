
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, RefreshCw, Smartphone, Monitor, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface PagePreviewTabProps {
  getPublicPageUrl: () => string;
}

const PagePreviewTab: React.FC<PagePreviewTabProps> = ({ getPublicPageUrl }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadAttempts, setLoadAttempts] = useState(0);
  
  // Calculate preview URL with timestamp to force refresh when needed
  useEffect(() => {
    updatePreviewUrl();
  }, [getPublicPageUrl]);
  
  const updatePreviewUrl = () => {
    try {
      const baseUrl = getPublicPageUrl();
      const timestamp = new Date().getTime();
      
      if (baseUrl === '#') {
        console.error("Invalid page slug, cannot generate preview URL");
        setLoadError(true);
        setErrorMessage("Invalid page slug. Please set a valid slug in page settings.");
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
      setLoadAttempts(prev => prev + 1);
    } catch (error) {
      console.error("Error generating preview URL:", error);
      setLoadError(true);
      setErrorMessage("Error generating preview URL. Please try again.");
    }
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true);
    setLoadError(false);
    updatePreviewUrl();
    
    // Visual feedback for refresh operation
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Device dimension settings
  const mobileWidth = viewMode === 'mobile' ? '390px' : '100%';
  const mobileHeight = viewMode === 'mobile' ? '844px' : 'calc(100vh - 300px)';
  
  // Handle iframe load events
  const handleIframeLoad = () => {
    console.log("Preview iframe loaded successfully");
    setIsLoading(false);
  };
  
  const handleIframeError = () => {
    console.error("Failed to load preview iframe");
    setLoadError(true);
    setErrorMessage("Could not load the preview. This may be due to browser security restrictions.");
    setIsLoading(false);
    toast({
      variant: "destructive",
      title: "Preview failed to load",
      description: "Could not load the page preview. Please try opening in a new tab."
    });
  };

  // Set a timeout to avoid infinite loading state
  useEffect(() => {
    if (isLoading && loadAttempts > 0) {
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          setLoadError(true);
          setErrorMessage("Preview loading timed out. Try refreshing or opening in a new tab.");
          setIsLoading(false);
        }
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, loadAttempts]);

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
                  <div className="flex flex-col items-center justify-center bg-muted h-[300px] p-6">
                    <LoadingSpinner size="lg" className="mb-4" />
                    <p className="text-sm text-muted-foreground">Loading preview...</p>
                  </div>
                )}
                <iframe
                  src={previewUrl}
                  style={{
                    width: '100%',
                    height: mobileHeight,
                    display: isLoading ? 'none' : 'block'
                  }}
                  title="Page Preview"
                  key={previewUrl} // Force iframe reload when URL changes
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  loading="lazy"
                  allow="same-origin"
                  referrerPolicy="same-origin"
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center bg-muted/30 h-[300px] p-6 text-center">
                <AlertCircle className="h-10 w-10 mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">
                  {errorMessage || (previewUrl === '#' ? 
                    "Please set a page slug in the settings to enable preview." :
                    "Preview could not be loaded. This might be due to browser security restrictions."
                  )}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleRefresh}
                  >
                    Try again
                  </Button>
                  <Button 
                    variant="secondary"
                    disabled={getPublicPageUrl() === '#'}
                    asChild
                  >
                    <a href={getPublicPageUrl()} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in new tab
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6 flex flex-col sm:flex-row justify-between gap-3">
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
