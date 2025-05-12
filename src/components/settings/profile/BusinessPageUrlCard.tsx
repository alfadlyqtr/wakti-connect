
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, QrCode, Share } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tables } from "@/integrations/supabase/types";

interface BusinessPageUrlCardProps {
  profile: Tables<"profiles"> & {
    email?: string;
  };
}

const BusinessPageUrlCard: React.FC<BusinessPageUrlCardProps> = ({ profile }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Get the business page URL using the slug or generate one from the business name
  const getBusinessPageUrl = () => {
    const baseUrl = window.location.origin;
    const slug = profile?.slug || (profile?.business_name ? 
      profile.business_name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') : '');
    return `${baseUrl}/${slug}`;
  };

  const businessUrl = getBusinessPageUrl();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(businessUrl);
      setCopied(true);
      toast({
        title: "URL copied to clipboard",
        description: "Share this link with your customers",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please try again or copy the URL manually",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile?.business_name || "My Business Page",
          text: "Check out my business page!",
          url: businessUrl,
        });
        toast({
          title: "Shared successfully",
          description: "Your business page has been shared",
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Card className="shadow-sm mb-4">
      <CardHeader>
        <CardTitle>Business Page URL</CardTitle>
        <CardDescription>
          Share this link with your customers to view your business page
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted p-3 rounded-md flex items-center justify-between break-all">
            <div className="text-sm text-muted-foreground overflow-hidden text-ellipsis">
              {businessUrl}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center whitespace-nowrap" 
                onClick={handleCopyLink}
              >
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              {navigator.share && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center whitespace-nowrap" 
                  onClick={handleShare}
                >
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
              )}
              <Button
                variant="outline" 
                size="sm" 
                className="flex items-center whitespace-nowrap" 
                onClick={() => setShowQR(!showQR)}
              >
                <QrCode className="h-4 w-4 mr-1" />
                QR
              </Button>
            </div>
          </div>

          {showQR && (
            <div className="flex flex-col items-center p-2 bg-background border rounded-md">
              <p className="text-xs text-muted-foreground mb-2">
                Scan this QR code to visit your business page
              </p>
              <div className="w-40 h-40 bg-muted flex items-center justify-center">
                {/* We can implement actual QR code here, but for now just placeholder */}
                <p className="text-xs text-center p-4">
                  QR code for<br/>{businessUrl}
                </p>
              </div>
            </div>
          )}

          <div className="bg-muted/50 p-3 rounded-md">
            <h4 className="text-sm font-medium mb-1">About your business page</h4>
            <p className="text-xs text-muted-foreground">
              This page displays your business profile, services, and allows customers to book 
              appointments. You can customize this page in the Business Pages section.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessPageUrlCard;
