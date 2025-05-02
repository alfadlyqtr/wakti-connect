
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CopyIcon, CheckIcon, ShareIcon, ExternalLink } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface SimpleShareLinkProps {
  shareId?: string;
}

export default function SimpleShareLink({ shareId }: SimpleShareLinkProps) {
  const [copied, setCopied] = useState(false);
  
  // Don't attempt to generate URL if shareId is missing
  if (!shareId) {
    return (
      <div className="w-full p-4 bg-muted rounded-lg text-center">
        <p className="text-sm text-muted-foreground">
          Save the invitation first to generate a shareable link
        </p>
      </div>
    );
  }

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

  const shareViaService = (service: string) => {
    let url = '';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent('Invitation');
    
    switch (service) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedTitle}%3A%20${encodedUrl}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
        break;
      case 'sms':
        url = `sms:?body=${encodedTitle}%3A%20${encodedUrl}`;
        break;
      default:
        return;
    }
    
    window.open(url, '_blank');
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="default"
              size="icon"
              className="flex-shrink-0"
              title="Share"
            >
              <ShareIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => shareViaService('whatsapp')}>
              WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => shareViaService('email')}>
              Email
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => shareViaService('sms')}>
              SMS
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(shareUrl, '_blank')}>
              <span className="flex items-center">
                Open Link <ExternalLink className="ml-2 h-3 w-3" />
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Anyone with this link can view your invitation
      </p>
    </div>
  );
}
