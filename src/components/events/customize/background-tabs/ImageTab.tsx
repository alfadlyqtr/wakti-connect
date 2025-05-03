import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

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
  const [customPrompt, setCustomPrompt] = useState("");
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);

  // Handler for URL change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Handler for image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handler for AI generation
  const handleGenerateAI = () => {
    // If custom prompt is shown and has content, use it
    if (showCustomPrompt && customPrompt.trim()) {
      console.log("Using custom prompt for AI generation:", customPrompt);
      onGenerateAI?.(customPrompt.trim());
    } else {
      // Otherwise generate based on title/description
      console.log("Generating AI image based on event details");
      onGenerateAI?.();
    }
  };

  // Toggle custom prompt input
  const toggleCustomPrompt = () => {
    setShowCustomPrompt(!showCustomPrompt);
    if (showCustomPrompt) {
      setCustomPrompt("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="background-image-url">Image URL</Label>
        <Input
          id="background-image-url"
          placeholder="Enter image URL..."
          value={value}
          onChange={handleUrlChange}
        />
      </div>

      <div className="space-y-2">
        <Label>Upload Image</Label>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>AI Generated Image</Label>
          <Button
            variant="link"
            size="sm"
            className="text-xs px-0"
            onClick={toggleCustomPrompt}
          >
            {showCustomPrompt ? "Use event details" : "Use custom prompt"}
          </Button>
        </div>
        
        {showCustomPrompt ? (
          <Textarea
            placeholder="Describe the image you want to generate..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="min-h-20"
          />
        ) : (
          <div className="text-sm text-muted-foreground">
            {title || description ? (
              <p>Image will be generated based on your event details.</p>
            ) : (
              <p>Add event details to improve AI generation.</p>
            )}
          </div>
        )}
        
        <Button
          variant="default"
          className="w-full"
          onClick={handleGenerateAI}
          disabled={isGenerating || (showCustomPrompt && !customPrompt.trim())}
        >
          {isGenerating ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate with AI
            </>
          )}
        </Button>
      </div>

      {value && (
        <div className="mt-4">
          <Label>Preview</Label>
          <div className="mt-2 border rounded-md overflow-hidden aspect-video bg-muted">
            <img
              src={value}
              alt="Background preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageTab;
