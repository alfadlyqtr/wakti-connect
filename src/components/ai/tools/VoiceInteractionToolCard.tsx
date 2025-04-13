
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Square, Send, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { testEdgeFunction } from '@/integrations/supabase/helper';
import { cn } from '@/lib/utils';
import { SimplifiedVoiceRecorder } from '../voice/SimplifiedVoiceRecorder';
import { parseTaskWithAI, convertParsedTaskToFormData } from '@/services/ai/aiTaskParserService';

interface VoiceInteractionToolCardProps {
  onSpeechRecognized: (text: string) => void;
}

export const VoiceInteractionToolCard: React.FC<VoiceInteractionToolCardProps> = ({ onSpeechRecognized }) => {
  const { toast } = useToast();
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isProcessingTask, setIsProcessingTask] = useState(false);
  
  const handleTranscriptReady = async (text: string) => {
    setTranscript(text);
    
    // Try to parse as task if the text seems task-related
    if (text.toLowerCase().includes('task') || 
        text.toLowerCase().includes('remind') || 
        text.toLowerCase().includes('need to') ||
        text.toLowerCase().includes('have to')) {
      
      setIsProcessingTask(true);
      try {
        const parsedTask = await parseTaskWithAI(text);
        
        if (parsedTask) {
          toast({
            title: "Task detected!",
            description: `Voice input recognized as a task: "${parsedTask.title}"`,
            variant: "default"
          });
        }
      } catch (err) {
        console.error("Task parsing error:", err);
      } finally {
        setIsProcessingTask(false);
      }
    }
  };
  
  const handleSubmit = () => {
    if (transcript) {
      onSpeechRecognized(transcript);
      setTranscript('');
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    setError(null);
    
    try {
      // Check if OpenAI API key is configured
      const testResult = await testEdgeFunction('ai-voice-to-text');
      
      // testEdgeFunction returns a boolean, not an object with data and error properties
      if (!testResult) {
        throw new Error('Voice transcription service unavailable. Please try again later.');
      }
      
      toast({
        title: "Connection Successful",
        description: "Voice transcription service is available now",
        variant: "default"
      });
    } catch (err) {
      console.error('API connection test error:', err);
      toast({
        title: "Service Unavailable",
        description: err instanceof Error ? err.message : "Voice transcription service is unavailable",
        variant: "destructive"
      });
      setError('Voice transcription service is currently unavailable');
    } finally {
      setIsRetrying(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-wakti-blue" />
          Voice to Text
          {isRetrying && <RefreshCw className="h-4 w-4 animate-spin ml-2" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted rounded-md p-3 min-h-24 text-sm relative">
          {transcript ? (
            <p>{transcript}</p>
          ) : (
            <p className="text-muted-foreground">
              Click the microphone button and speak to convert your voice to text...
            </p>
          )}
          
          {isProcessingTask && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="h-5 w-5 animate-spin mb-2" />
                <p className="text-sm">Analyzing as a task...</p>
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="text-destructive text-sm p-3 bg-destructive/10 rounded-md flex items-center justify-between">
            <span>{error}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRetry}
              disabled={isRetrying}
              className="h-8 text-xs"
            >
              <RefreshCw className={cn("h-3 w-3 mr-1", isRetrying && "animate-spin")} />
              Retry
            </Button>
          </div>
        )}
        
        <div className="flex gap-2 justify-between">
          <SimplifiedVoiceRecorder
            onTranscriptReady={handleTranscriptReady}
            onCancel={() => {}}
            compact={true}
            processAsTask={true}
          />
          
          <Button
            onClick={handleSubmit}
            disabled={!transcript}
          >
            <Send className="h-4 w-4 mr-2" />
            Use Text
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
