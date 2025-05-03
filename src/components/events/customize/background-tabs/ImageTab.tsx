
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from 'lucide-react';

interface ImageTabProps {
  value: string;
  onChange: (value: string) => void;
  title?: string;
  description?: string;
  onGenerateAI?: (customPrompt?: string) => void;
  isGenerating?: boolean;
}

const ImageTab: React.FC<ImageTabProps> = ({
  value,
  onChange,
  title,
  description,
  onGenerateAI,
  isGenerating = false
}) => {
  const [imageUrl, setImageUrl] = useState<string>(value);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };
  
  const handleInputBlur = () => {
    onChange(imageUrl);
  };
  
  const handleGenerateAI = () => {
    if (onGenerateAI) {
      console.log("ImageTab: Sending custom prompt:", customPrompt || "Using event details");
      onGenerateAI(customPrompt);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          type="url"
          id="imageUrl"
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={handleUrlChange}
          onBlur={handleInputBlur}
        />
      </div>
      
      {onGenerateAI && (
        <div className="space-y-4 pt-2">
          <Label htmlFor="customPrompt">Custom AI Prompt (optional)</Label>
          <Input
            id="customPrompt"
            placeholder={title ? `Background for "${title}"` : "Describe your ideal background image"}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
          />
          <Button
            type="button"
            className="w-full"
            variant="secondary"
            onClick={handleGenerateAI}
            disabled={isGenerating}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate AI Background'}
          </Button>
          <p className="text-xs text-muted-foreground">
            {!customPrompt && title && description 
              ? `We'll generate a beautiful background based on "${title}" and its description.`
              : "We'll create a beautiful image based on your prompt."}
          </p>
        </div>
      )}
      
      {value && (
        <div className="relative border rounded-md overflow-hidden mt-4 aspect-video">
          <img
            src={value}
            alt="Background preview"
            className="object-cover w-full h-full"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/400x300?text=Invalid+Image+URL";
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageTab;
