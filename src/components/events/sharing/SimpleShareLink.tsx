
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Share } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SimpleShareLinkProps {
  title: string;
  shareUrl: string;
  previewImage?: string; // Optional URL for preview image
}

const SimpleShareLink: React.FC<SimpleShareLinkProps> = ({ title, shareUrl, previewImage }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "Sharing link has been copied to your clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Error",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  // Function to share using the Web Share API if available
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: shareUrl,
        text: `Check out this invitation: ${title}`
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback if Web Share API is not available
      copyToClipboard();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your {title}</CardTitle>
        <CardDescription>
          Copy this link to share with anyone
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {previewImage && (
          <div className="relative rounded-md overflow-hidden aspect-video mb-4 bg-muted">
            <img 
              src={previewImage} 
              alt="Preview"
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <h3 className="font-medium text-lg">{title}</h3>
              <p className="text-sm opacity-90">Click to view invitation</p>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Label htmlFor="share-url" className="sr-only">Share URL</Label>
            <Input
              id="share-url"
              value={shareUrl}
              readOnly
              className="w-full font-mono text-sm"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            title="Copy to clipboard"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </Button>
          <Button
            size="icon"
            onClick={handleShare}
            title="Share"
          >
            <Share size={18} />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          <Button 
            variant="outline" 
            size="sm"
            className="text-sm"
            onClick={() => {
              window.open(`https://wa.me/?text=${encodeURIComponent(`${title}: ${shareUrl}`)}`, '_blank');
            }}
          >
            Share via WhatsApp
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="text-sm"
            onClick={() => {
              window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this invitation: ${shareUrl}`)}`, '_blank');
            }}
          >
            Share via Email
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="text-sm"
            onClick={() => {
              window.open(`sms:?body=${encodeURIComponent(`${title}: ${shareUrl}`)}`, '_blank');
            }}
          >
            Share via SMS
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleShareLink;
