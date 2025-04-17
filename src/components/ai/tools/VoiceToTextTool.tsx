
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send, CheckCheck, Loader2, AlertCircle } from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { toast } from '@/components/ui/use-toast';
import { VoiceRecordingVisualizer } from '../voice/VoiceRecordingVisualizer';

interface VoiceToTextToolProps {
  onTranscriptReady?: (text: string) => void;
  compact?: boolean;
}

export const VoiceToTextTool: React.FC<VoiceToTextToolProps> = ({ 
  onTranscriptReady,
  compact = false
}) => {
  const [showTranscriptInput, setShowTranscriptInput] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState('');
  const [transcriptConfirmed, setTranscriptConfirmed] = useState(false);
  
  const { 
    isListening, 
    isProcessing, 
    transcript,
    lastTranscript,
    startListening, 
    stopListening,
    supportsVoice,
    error,
    recordingDuration
  } = useVoiceInteraction({
    onTranscriptComplete: (text) => {
      setEditedTranscript(text);
      setShowTranscriptInput(true);
      setTranscriptConfirmed(false);
    }
  });

  const handleStartRecording = () => {
    setTranscriptConfirmed(false);
    setEditedTranscript('');
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const handleConfirmTranscript = () => {
    if (editedTranscript) {
      setTranscriptConfirmed(true);
      
      if (onTranscriptReady) {
        onTranscriptReady(editedTranscript);
      }
      
      toast({
        title: "Transcript confirmed",
        description: "Your voice has been converted to text",
        duration: 2000,
      });
    }
  };
  
  const handleRetry = () => {
    setTranscriptConfirmed(false);
    setShowTranscriptInput(false);
    setEditedTranscript('');
  };

  return (
    <Card className={compact ? "w-full" : "w-full max-w-3xl mx-auto"}>
      <CardHeader className={compact ? "pb-2" : ""}>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-blue-500" />
          Voice to Text
        </CardTitle>
        {!compact && (
          <CardDescription>
            Speak to record your voice and convert it to text
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!supportsVoice && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 p-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Voice recording not supported</p>
              <p className="text-sm mt-1">Your browser doesn't support voice recording. Please use Chrome, Edge, or Safari for full functionality.</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error.message}</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-4">
          {/* Recording Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={isListening ? handleStopRecording : handleStartRecording}
              disabled={!supportsVoice || isProcessing}
              variant={isListening ? "destructive" : "default"}
              className="relative"
              size="lg"
            >
              {isListening ? (
                <>
                  <MicOff className="h-5 w-5 mr-2" />
                  Stop Recording {recordingDuration > 0 ? `(${Math.floor(recordingDuration)}s)` : ''}
                </>
              ) : isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5 mr-2" />
                  Start Recording
                </>
              )}
            </Button>
            
            {transcriptConfirmed && (
              <Button 
                variant="outline" 
                onClick={handleRetry}
                className="gap-2"
              >
                <Mic className="h-4 w-4" />
                Record Again
              </Button>
            )}
          </div>
          
          {/* Audio Visualizer */}
          {isListening && (
            <div className="h-20 flex items-center justify-center">
              <VoiceRecordingVisualizer 
                isActive={isListening} 
                audioLevel={0.5}
                size="lg"
              />
            </div>
          )}
          
          {/* Transcript Display/Edit */}
          {showTranscriptInput && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">
                  {transcriptConfirmed ? "Confirmed Transcript" : "Review your transcript"}
                </h3>
                
                {!transcriptConfirmed && (
                  <Button 
                    onClick={handleConfirmTranscript} 
                    size="sm" 
                    className="h-8"
                    disabled={!editedTranscript}
                  >
                    <Send className="h-3.5 w-3.5 mr-1" />
                    Confirm
                  </Button>
                )}
              </div>
              
              {transcriptConfirmed ? (
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-800">
                  <div className="flex items-center text-green-800 dark:text-green-200 mb-1">
                    <CheckCheck className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">Transcript confirmed</span>
                  </div>
                  <p className="text-sm">{editedTranscript}</p>
                </div>
              ) : (
                <textarea
                  value={editedTranscript}
                  onChange={(e) => setEditedTranscript(e.target.value)}
                  className="w-full h-32 p-2 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Edit your transcript if needed..."
                />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
