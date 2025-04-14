
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ImageIcon, 
  SparklesIcon, 
  RefreshCw,
  Download,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGenerationToolProps {
  onClose?: () => void;
}

export const ImageGenerationTool = ({ onClose }: ImageGenerationToolProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [provider, setProvider] = useState<'runware' | 'dalle'>('runware');
  
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      // In a real implementation, you'd call the Runware API with fallback to DALL·E
      // For now, simulate an API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate an image URL
      setGeneratedImage(`https://placehold.co/512x512/random?text=${encodeURIComponent(prompt)}`);
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownload = () => {
    if (!generatedImage) return;
    
    // In a real implementation, you'd download the image
    window.open(generatedImage, '_blank');
  };
  
  const handleReset = () => {
    setGeneratedImage(null);
    setPrompt('');
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Image Generation
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs value={provider} onValueChange={(value) => setProvider(value as 'runware' | 'dalle')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="runware">
              Runware.ai <span className="text-xs ml-1 opacity-60">(Primary)</span>
            </TabsTrigger>
            <TabsTrigger value="dalle">
              DALL·E <span className="text-xs ml-1 opacity-60">(Backup)</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {!generatedImage ? (
          <>
            <Textarea
              placeholder="Describe the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-20 resize-none"
              disabled={isGenerating}
            />
            
            <Button 
              onClick={handleGenerate} 
              disabled={!prompt.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Generate Image
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="relative aspect-square rounded-md overflow-hidden border">
              <img 
                src={generatedImage} 
                alt={prompt} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleReset} 
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                New Image
              </Button>
              
              <Button 
                onClick={handleDownload} 
                variant="secondary"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
