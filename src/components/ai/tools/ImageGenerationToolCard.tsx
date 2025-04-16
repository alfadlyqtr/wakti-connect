
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, RefreshCcw, Image, Loader2 } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/ai/useSpeechRecognition';
import { toast } from '@/components/ui/use-toast';
import { handleImageGeneration } from '@/hooks/ai/utils/imageHandling';

interface ImageGenerationToolCardProps {
  onSubmitPrompt: (prompt: string) => void;
  isLoading?: boolean;
}

export const ImageGenerationToolCard: React.FC<ImageGenerationToolCardProps> = ({
  onSubmitPrompt,
  isLoading = false
}) => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  // Get speech recognition utilities
  const {
    isRecording,
    startRecording,
    stopRecording,
    transcript,
    error: recognitionError,
    isProcessing,
    supported
  } = useSpeechRecognition({
    silenceThreshold: 0.02,
    silenceTimeout: 1500
  });
  
  // Clear errors when prompt changes
  useEffect(() => {
    if (error) setError(null);
  }, [prompt, error]);
  
  // Update prompt with recognized speech
  useEffect(() => {
    if (transcript && !isRecording) {
      setPrompt(prev => prev ? `${prev} ${transcript}` : transcript);
    }
  }, [transcript, isRecording]);
  
  // Handle error from speech recognition
  useEffect(() => {
    if (recognitionError) {
      setError(recognitionError.message);
    }
  }, [recognitionError]);
  
  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('Please enter an image description');
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Generate image directly
      const result = await handleImageGeneration(prompt.trim());
      
      if (result.success && result.imageUrl) {
        setGeneratedImage(result.imageUrl);
        
        // Also send the prompt to the parent component for the chat
        onSubmitPrompt(prompt.trim());
        
        // Show success message with provider info
        toast({
          title: "Image Generated Successfully",
          description: result.provider 
            ? `Created using ${result.provider} image generation` 
            : "Your image has been created successfully",
          variant: "default"
        });
      } else {
        setError(result.error || "Failed to generate image");
      }
      
      // Clear the prompt
      setPrompt('');
    } catch (e) {
      console.error("Error generating image:", e);
      setError(e.message || "Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5 text-wakti-blue" />
          AI Image Generation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {generatedImage ? (
          <div className="space-y-3">
            <div className="relative aspect-square rounded-md overflow-hidden border">
              <img 
                src={generatedImage} 
                alt={prompt} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <Button 
              onClick={() => setGeneratedImage(null)} 
              variant="outline"
              className="w-full"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Generate Another Image
            </Button>
          </div>
        ) : (
          <>
            <Textarea
              placeholder="Describe the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[80px]"
              disabled={isLoading || isGenerating}
            />
            
            {error && (
              <div className="text-sm text-red-500 mt-1">{error}</div>
            )}
            
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={handleSubmit}
                disabled={!prompt.trim() || isLoading || isGenerating}
                className="flex-1"
              >
                {isLoading || isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : "Generate Image"}
              </Button>
            </div>

            {/* Voice input */}
            {supported && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (isRecording) {
                      stopRecording();
                    } else {
                      startRecording();
                    }
                  }}
                  className={isRecording ? "bg-red-100 border-red-300" : ""}
                  title={isRecording ? "Stop listening" : "Speak your prompt"}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
