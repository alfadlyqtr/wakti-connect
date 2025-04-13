
import React, { useState, useEffect } from 'react';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, AlertCircle, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const VoiceTestPage: React.FC = () => {
  const {
    isListening,
    transcript,
    lastTranscript,
    error,
    supportsVoice,
    startListening,
    stopListening
  } = useVoiceInteraction({
    continuousListening: false
  });

  const [audioLevel, setAudioLevel] = useState(0);
  const [transcriptHistory, setTranscriptHistory] = useState<string[]>([]);

  // Simulate audio level for visualization
  useEffect(() => {
    let interval: number;
    if (isListening) {
      interval = window.setInterval(() => {
        setAudioLevel(Math.random());
      }, 100);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  // Add completed transcripts to history
  useEffect(() => {
    if (lastTranscript && lastTranscript.trim() !== '') {
      setTranscriptHistory(prev => [lastTranscript, ...prev].slice(0, 5));
    }
  }, [lastTranscript]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Voice Input Test</h1>
      
      <div className="max-w-2xl mx-auto">
        {!supportsVoice ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Browser Not Supported</AlertTitle>
            <AlertDescription>
              Your browser doesn't support voice recognition. Please try Chrome, Edge, or Safari.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="default" className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Voice Recognition Supported</AlertTitle>
            <AlertDescription>
              Your browser supports voice recognition. You can test it below.
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-primary" />
              Voice Input Test
            </CardTitle>
            <CardDescription>
              Click the button below to start recording, and speak into your microphone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              <Button
                size="lg"
                disabled={!supportsVoice}
                onClick={isListening ? stopListening : startListening}
                className={`rounded-full w-16 h-16 ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
              >
                {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>
              
              <div className="w-full max-w-md">
                <div className="flex justify-between text-sm mb-1">
                  <span>Audio Level</span>
                  <span>{Math.round(audioLevel * 100)}%</span>
                </div>
                <Progress value={audioLevel * 100} className="h-2" />
              </div>
              
              <div className="w-full p-4 border rounded-md min-h-[100px] bg-muted/30">
                {isListening ? (
                  <p className="text-primary animate-pulse">{transcript || "Listening..."}</p>
                ) : (
                  <p className="text-muted-foreground">
                    {lastTranscript || "Press the microphone button and speak"}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col">
            {error && (
              <Alert variant="destructive" className="mb-4 w-full">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error.message || "There was an error with voice recognition."}
                </AlertDescription>
              </Alert>
            )}
            
            {transcriptHistory.length > 0 && (
              <>
                <Separator className="my-4" />
                <div className="w-full">
                  <h3 className="font-medium mb-2">Recent Transcripts</h3>
                  <ul className="space-y-2">
                    {transcriptHistory.map((text, index) => (
                      <li key={index} className="text-sm border-l-2 border-primary pl-2">
                        "{text}"
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </CardFooter>
        </Card>
        
        <div className="text-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoiceTestPage;
