
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CopyIcon, CheckIcon, ShareIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface SimpleShareLinkProps {
  shareId: string;
}

export default function SimpleShareLink({ shareId }: SimpleShareLinkProps) {
  const [copied, setCopied] = useState(false);
  
  // Generate the full share URL
  const shareUrl = `${window.location.origin}/invitation/${shareId}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      toast({
        title: "Link copied",
        description: "The invitation link has been copied to your clipboard"
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Copy failed",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };

  const shareViaNavigator = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Invitation',
          url: shareUrl
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="w-full">
      <div className="flex space-x-2">
        <div className="flex-1">
          <Input 
            value={shareUrl} 
            readOnly 
            className="w-full" 
          />
        </div>
        <Button 
          onClick={copyToClipboard}
          variant="outline"
          size="icon"
          className="flex-shrink-0"
          title="Copy to clipboard"
        >
          {copied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
        </Button>
        <Button 
          onClick={shareViaNavigator}
          variant="default"
          size="icon"
          className="flex-shrink-0"
          title="Share"
        >
          <ShareIcon className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Anyone with this link can view your invitation
      </p>
    </div>
  );
}
