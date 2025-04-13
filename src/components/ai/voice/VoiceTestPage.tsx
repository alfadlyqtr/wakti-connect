import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Play, Square, Volume2, VolumeX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { stopMediaTracks } from '@/utils/audio/audioProcessing';
import { useVoiceSettings } from '@/store/voiceSettings';

type MicStatus = 'valid' | 'invalid' | 'unknown' | 'checking';

const VoiceTestPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [micStatus, setMicStatus] = useState<MicStatus>('unknown');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [volume, setVolume] = useState(0);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  
  const animationRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { 
    autoSilenceDetection, 
    toggleAutoSilenceDetection,
    visualFeedback,
    toggleVisualFeedback,
    language,
    setLanguage
  } = useVoiceSettings();

  // Initialize audio context and speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      
      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptText = result[0].transcript;
        setTranscript(transcriptText);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setMicStatus('invalid');
        }
      };
      
      setSpeechRecognition(recognition);
    } else {
      console.error('Speech recognition not supported in this browser');
    }
    
    // Initialize audio context
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(audioCtx);
    
    const analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 256;
    setAnalyser(analyserNode);
    
    return () => {
      if (audioStream) {
        stopMediaTracks(audioStream);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [language]);

  // Check microphone access
  useEffect(() => {
    const checkMicrophone = async () => {
      setMicStatus('checking');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stopMediaTracks(stream);
        setMicStatus('valid');
      } catch (error) {
        console.error('Microphone access error:', error);
        setMicStatus('invalid');
      }
    };
    
    checkMicrophone();
  }, []);

  // Draw audio visualization
  const drawVisualization = () => {
    if (!analyser || !canvasRef.current || !visualFeedback) return;
    
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      
      analyser.getByteFrequencyData(dataArray);
      
      canvasCtx.fillStyle = 'rgb(20, 20, 20)';
      canvasCtx.fillRect(0, 0, width, height);
      
      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        
        // Calculate volume level (average of frequency data)
        if (i === 0) {
          let sum = 0;
          for (let j = 0; j < bufferLength; j++) {
            sum += dataArray[j];
          }
          const avgVolume = sum / bufferLength;
          setVolume(avgVolume);
        }
        
        canvasCtx.fillStyle = `rgb(50, ${75 + barHeight}, 255)`;
        canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };
    
    draw();
  };

  // Start recording
  const startRecording = async () => {
    try {
      if (micStatus !== "checking" && micStatus !== 'valid') {
        // Try to get microphone access again
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);
        setMicStatus('valid');
        
        if (audioContext && analyser) {
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);
          drawVisualization();
        }
      } else if (audioStream) {
        if (audioContext && analyser) {
          const source = audioContext.createMediaStreamSource(audioStream);
          source.connect(analyser);
          drawVisualization();
        }
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);
        
        if (audioContext && analyser) {
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);
          drawVisualization();
        }
      }
      
      if (speechRecognition) {
        speechRecognition.start();
      }
      
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setMicStatus('invalid');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (speechRecognition) {
      speechRecognition.stop();
    }
    
    if (audioStream) {
      stopMediaTracks(audioStream);
      setAudioStream(null);
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsRecording(false);
    setVolume(0);
  };

  // Toggle audio
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Voice Recognition Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Microphone Test</CardTitle>
            <CardDescription>
              Test your microphone and voice recognition capabilities
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label>Microphone Status:</Label>
                {micStatus === 'checking' ? (
                  <Badge variant="outline" className="animate-pulse">Checking...</Badge>
                ) : micStatus === 'valid' ? (
                  <Badge variant="success">Available</Badge>
                ) : (
                  <Badge variant="destructive">Not Available</Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Label>Audio:</Label>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleAudio}
                >
                  {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            {visualFeedback && (
              <div className="w-full h-32 bg-black rounded-md overflow-hidden">
                <canvas 
                  ref={canvasRef} 
                  width={500} 
                  height={128} 
                  className="w-full h-full"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label>Volume:</Label>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-100"
                    style={{ width: `${Math.min(volume * 100 / 128, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm font-medium mb-2">Transcript:</p>
              <p className="text-sm">{transcript || "Speak to see transcription..."}</p>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            {!isRecording ? (
              <Button 
                onClick={startRecording}
                disabled={micStatus === 'invalid'}
                className="w-full"
              >
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            ) : (
              <Button 
                onClick={stopRecording}
                variant="destructive"
                className="w-full"
              >
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Voice Settings</CardTitle>
            <CardDescription>
              Configure voice recognition settings
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-silence">Auto Silence Detection</Label>
              <Switch 
                id="auto-silence" 
                checked={autoSilenceDetection}
                onCheckedChange={toggleAutoSilenceDetection}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="visual-feedback">Visual Feedback</Label>
              <Switch 
                id="visual-feedback" 
                checked={visualFeedback}
                onCheckedChange={toggleVisualFeedback}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Language</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={language === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('en')}
                >
                  English
                </Button>
                <Button 
                  variant={language === 'es' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('es')}
                >
                  Spanish
                </Button>
                <Button 
                  variant={language === 'fr' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('fr')}
                >
                  French
                </Button>
                <Button 
                  variant={language === 'de' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('de')}
                >
                  German
                </Button>
                <Button 
                  variant={language === 'ar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('ar')}
                >
                  Arabic
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <div className="text-sm text-muted-foreground">
              Voice settings are automatically saved to your profile.
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">How to Use Voice Recognition</h2>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">1. Allow Microphone Access</h3>
            <p className="text-sm">
              When prompted, allow microphone access in your browser. If you denied access, 
              you'll need to reset permissions in your browser settings.
            </p>
          </div>
          
          <div className="p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">2. Start Recording</h3>
            <p className="text-sm">
              Click the "Start Recording" button and speak clearly. The transcript will appear 
              in real-time as you speak.
            </p>
          </div>
          
          <div className="p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">3. Adjust Settings</h3>
            <p className="text-sm">
              Configure voice settings to improve recognition accuracy. Auto silence detection 
              will automatically stop recording after a period of silence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceTestPage;
