
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardIcon, LinkIcon, CheckIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tables } from "@/integrations/supabase/types";

interface BusinessProfileInfoProps {
  profile: Tables<"profiles">;
}

const BusinessProfileInfo: React.FC<BusinessProfileInfoProps> = ({ profile }) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState<boolean>(false);
  
  const baseUrl = window.location.origin;
  
  // Use the businessId directly for a more reliable link
  const businessUrl = `${baseUrl}/business/${profile.id}`;
  
  // Or use the slug if available (which will be resolved to the businessId)
  // Alternatively can use the slug-based URL
  // const businessUrl = `${baseUrl}/${profile.slug || profile.id}`;
  
  const copyLink = () => {
    navigator.clipboard.writeText(businessUrl);
    setCopied(true);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share it with your customers",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const visitBusinessPage = () => {
    window.open(businessUrl, '_blank');
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Public Business Page
        </CardTitle>
        <CardDescription>
          Your business page is accessible to the public. Share this link with your customers.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md overflow-hidden">
            <div className="truncate text-sm flex-1">
              {businessUrl}
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={copyLink}
              className="flex-shrink-0"
            >
              {copied ? (
                <CheckIcon className="h-4 w-4 mr-1" />
              ) : (
                <ClipboardIcon className="h-4 w-4 mr-1" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          
          <div className="flex justify-end">
            <Button variant="default" onClick={visitBusinessPage}>
              View Public Page
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessProfileInfo;
