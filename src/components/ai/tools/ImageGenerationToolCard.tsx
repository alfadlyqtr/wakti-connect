import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Square, RefreshCcw, Image } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/ai/useSpeechRecognition';
import { motion } from 'framer-motion';

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
  
  const handleSubmit = () => {
    if (!prompt.trim()) {
      setError('Please enter an image description');
      return;
    }
    
    onSubmitPrompt(prompt.trim());
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
        <Textarea
          placeholder="Describe the image you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[80px]"
          disabled={isLoading}
        />
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={handleSubmit}
            disabled={!prompt.trim() || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
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
      </CardContent>
    </Card>
  );
};
