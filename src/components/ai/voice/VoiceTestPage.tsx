
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, Settings, CheckCircle, XCircle } from 'lucide-react';
import { VoiceRecordingVisualizer } from './VoiceRecordingVisualizer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';

export const VoiceTestPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [browserSupport, setBrowserSupport] = useState<{
    speechRecognition: boolean;
    speechSynthesis: boolean;
  }>({
    speechRecognition: false,
    speechSynthesis: false,
  });
  const [testVoice, setTestVoice] = useState('');
  const [volume, setVolume] = useState(50);
  const [audioLevel, setAudioLevel] = useState(0.5); // Add audio level state

  useEffect(() => {
    // Check browser support
    const hasSpeechRecognition =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    const hasSpeechSynthesis = 'speechSynthesis' in window;

    setBrowserSupport({
      speechRecognition: hasSpeechRecognition,
      speechSynthesis: hasSpeechSynthesis,
    });
  }, []);

  // Simulate changing audio levels when recording
  useEffect(() => {
    let interval: number | null = null;
    
    if (isRecording) {
      interval = window.setInterval(() => {
        setAudioLevel(Math.random() * 0.7 + 0.2); // Random value between 0.2 and 0.9
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setTranscription('');
    
    // Simulate recording for demo
    setTimeout(() => {
      setTranscription('This is a test transcription from your voice input.');
      setIsRecording(false);
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const speakText = () => {
    if (!browserSupport.speechSynthesis) return;
    
    const utterance = new SpeechSynthesisUtterance(testVoice || 'Hello, this is a test of the voice synthesis feature.');
    utterance.volume = volume / 100;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-8">
      <h1 className="text-3xl font-bold">Voice Input/Output Test</h1>
      <p className="text-muted-foreground">
        Test your browser's voice recognition and synthesis capabilities.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-wakti-blue" />
              Voice Recognition Test
            </CardTitle>
            <CardDescription>
              Test if your browser supports speech recognition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-sm">
              <span>Browser Support:</span>
              {browserSupport.speechRecognition ? (
                <span className="flex items-center text-green-500">
                  <CheckCircle className="h-4 w-4 mr-1" /> Supported
                </span>
              ) : (
                <span className="flex items-center text-red-500">
                  <XCircle className="h-4 w-4 mr-1" /> Not Supported
                </span>
              )}
            </div>

            <div className="h-24 bg-muted rounded-md flex items-center justify-center">
              {isRecording ? (
                <VoiceRecordingVisualizer isActive={isRecording} audioLevel={audioLevel} />
              ) : (
                <span className="text-muted-foreground text-sm">
                  {transcription || "Press 'Start Recording' to begin"}
                </span>
              )}
            </div>

            <div className="flex justify-center space-x-2">
              <Button
                onClick={startRecording}
                disabled={isRecording || !browserSupport.speechRecognition}
                variant="default"
              >
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
              <Button
                onClick={stopRecording}
                disabled={!isRecording}
                variant="outline"
              >
                <MicOff className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-wakti-blue" />
              Voice Synthesis Test
            </CardTitle>
            <CardDescription>
              Test if your browser supports speech synthesis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-sm">
              <span>Browser Support:</span>
              {browserSupport.speechSynthesis ? (
                <span className="flex items-center text-green-500">
                  <CheckCircle className="h-4 w-4 mr-1" /> Supported
                </span>
              ) : (
                <span className="flex items-center text-red-500">
                  <XCircle className="h-4 w-4 mr-1" /> Not Supported
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="test-voice">Text to Speak</Label>
              <Input
                id="test-voice"
                value={testVoice}
                onChange={(e) => setTestVoice(e.target.value)}
                placeholder="Enter text to be spoken"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Volume: {volume}%</Label>
              <Slider
                value={[volume]}
                onValueChange={(values) => setVolume(values[0])}
                min={0}
                max={100}
                step={1}
              />
            </div>

            <Button
              onClick={speakText}
              disabled={!browserSupport.speechSynthesis}
              className="w-full"
            >
              <Volume2 className="mr-2 h-4 w-4" />
              Test Voice Output
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-wakti-blue" />
            Voice Settings
          </CardTitle>
          <CardDescription>
            Configure voice settings for the AI assistant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            You can configure AI voice settings in your account settings under the AI Assistant tab.
          </p>
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={() => window.location.href = '/dashboard/settings?tab=ai-assistant'}>
              Go to Voice Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceTestPage;
