
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Mic, Square, Volume2, AlertCircle, CheckCircle2, Copy } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export const VoiceAPITester: React.FC = () => {
  const [activeTest, setActiveTest] = useState<'text-to-voice' | 'voice-to-text'>('text-to-voice');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('Hello, this is a test of the text to voice feature.');
  const [voiceSelection, setVoiceSelection] = useState('alloy');
  const [audioOutput, setAudioOutput] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  
  const resetState = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setAudioOutput(null);
    setResponseText(null);
    setProgress(0);
  };
  
  // Function to test OpenAI API key for text-to-voice
  const testTextToVoiceAPIKey = async () => {
    resetState();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-text-to-voice', {
        body: { test: true }
      });
      
      console.log("API key test response:", { data, error });
      
      if (error) {
        throw new Error(`API test failed: ${error.message}`);
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      setSuccessMessage("OpenAI API key is valid for text-to-voice conversions.");
    } catch (error) {
      console.error("Error testing API key:", error);
      setErrorMessage(`Error: ${error.message || "Unknown error occurred"}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to test OpenAI API key for voice-to-text
  const testVoiceToTextAPIKey = async () => {
    resetState();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { test: true }
      });
      
      console.log("API key test response:", { data, error });
      
      if (error) {
        throw new Error(`API test failed: ${error.message}`);
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      setSuccessMessage("OpenAI API key is valid for voice-to-text transcriptions.");
    } catch (error) {
      console.error("Error testing API key:", error);
      setErrorMessage(`Error: ${error.message || "Unknown error occurred"}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to convert text to speech
  const convertTextToSpeech = async () => {
    if (!textInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to convert to speech.",
        variant: "destructive"
      });
      return;
    }
    
    resetState();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-text-to-voice', {
        body: { 
          text: textInput,
          voice: voiceSelection
        }
      });
      
      if (error) {
        throw new Error(`Request failed: ${error.message}`);
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      if (!data?.audioContent) {
        throw new Error("No audio content returned");
      }
      
      setAudioOutput(data.audioContent);
      setSuccessMessage("Text successfully converted to speech!");
    } catch (error) {
      console.error("Error converting text to speech:", error);
      setErrorMessage(`Error: ${error.message || "Unknown error occurred"}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Set up recording functionality
  const startRecording = async () => {
    resetState();
    setAudioChunks([]);
    setRecordedAudio(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up recorder
      const newMediaRecorder = new MediaRecorder(stream);
      setMediaRecorder(newMediaRecorder);
      
      // Set up event handlers
      newMediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks(prev => [...prev, e.data]);
        }
      };
      
      newMediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setRecordedAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Process the recording
        processRecording(audioBlob);
      };
      
      // Start recording with a smaller timeslice for more frequent ondataavailable events
      newMediaRecorder.start(100);
      setIsRecording(true);
      
      // Automatically stop after 10 seconds to prevent too large files
      setTimeout(() => {
        if (newMediaRecorder.state === 'recording') {
          stopRecording();
        }
      }, 10000);
      
    } catch (error) {
      console.error("Error starting recording:", error);
      setErrorMessage(`Could not access microphone: ${error.message}`);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };
  
  // Convert the recorded audio blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // Extract the base64 part after the comma
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error("Failed to convert blob to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  // Process the recording
  const processRecording = async (audioBlob: Blob) => {
    if (!audioBlob) {
      setErrorMessage("No recording to process");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Start progress animation
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 95));
      }, 100);
      
      // Convert blob to base64
      const base64Audio = await blobToBase64(audioBlob);
      
      console.log("Sending audio data to process, size:", base64Audio.length);
      
      // Send to edge function
      const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
        body: { audio: base64Audio }
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (error) {
        throw new Error(`Request failed: ${error.message}`);
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      if (data?.warning) {
        setErrorMessage(`Warning: ${data.warning}`);
      }
      
      setResponseText(data.text || "");
      
      if (data.text) {
        setSuccessMessage("Audio successfully transcribed!");
      } else {
        setErrorMessage("No text was transcribed. Try speaking louder or longer.");
      }
    } catch (error) {
      console.error("Error processing recording:", error);
      setErrorMessage(`Error: ${error.message || "Unknown error occurred"}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };
  
  // Copy response to clipboard
  const copyToClipboard = () => {
    if (responseText) {
      navigator.clipboard.writeText(responseText);
      toast({
        title: "Copied to clipboard",
        description: "The transcribed text has been copied to your clipboard."
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>OpenAI Voice API Test Tool</CardTitle>
          <CardDescription>
            Test the OpenAI voice API integration for both text-to-voice and voice-to-text functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTest} onValueChange={(value) => setActiveTest(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text-to-voice">Text to Voice</TabsTrigger>
              <TabsTrigger value="voice-to-text">Voice to Text</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text-to-voice" className="space-y-4 mt-4">
              <div>
                <Button 
                  variant="outline" 
                  onClick={testTextToVoiceAPIKey}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing API...
                    </>
                  ) : (
                    "Test OpenAI API Key"
                  )}
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Voice Selection</Label>
                <RadioGroup 
                  value={voiceSelection} 
                  onValueChange={setVoiceSelection}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alloy" id="alloy" />
                    <Label htmlFor="alloy">Alloy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="echo" id="echo" />
                    <Label htmlFor="echo">Echo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fable" id="fable" />
                    <Label htmlFor="fable">Fable</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="onyx" id="onyx" />
                    <Label htmlFor="onyx">Onyx</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nova" id="nova" />
                    <Label htmlFor="nova">Nova</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shimmer" id="shimmer" />
                    <Label htmlFor="shimmer">Shimmer</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="text-input">Text to Convert</Label>
                <Textarea 
                  id="text-input" 
                  placeholder="Enter text to convert to speech..." 
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
              
              <Button
                onClick={convertTextToSpeech}
                disabled={isLoading || !textInput.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Volume2 className="mr-2 h-4 w-4" />
                    Convert to Speech
                  </>
                )}
              </Button>
              
              {audioOutput && (
                <div className="pt-4">
                  <Label>Audio Output</Label>
                  <div className="p-4 bg-muted rounded-md mt-2">
                    <audio 
                      controls 
                      src={`data:audio/mp3;base64,${audioOutput}`}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="voice-to-text" className="space-y-4 mt-4">
              <div>
                <Button 
                  variant="outline" 
                  onClick={testVoiceToTextAPIKey}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing API...
                    </>
                  ) : (
                    "Test OpenAI API Key"
                  )}
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Record Audio</Label>
                <div className="flex justify-center py-4">
                  {isRecording ? (
                    <Button 
                      variant="destructive"
                      size="lg"
                      className="h-16 w-16 rounded-full"
                      onClick={stopRecording}
                    >
                      <Square className="h-6 w-6" />
                    </Button>
                  ) : (
                    <Button 
                      variant="default"
                      size="lg"
                      className="h-16 w-16 rounded-full"
                      onClick={startRecording}
                      disabled={isLoading}
                    >
                      <Mic className="h-6 w-6" />
                    </Button>
                  )}
                </div>
                <div className="text-xs text-center text-muted-foreground">
                  {isRecording ? "Recording... Click to stop" : "Click to start recording"}
                </div>
              </div>
              
              {progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Processing audio...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
              
              {responseText !== null && (
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between items-center">
                    <Label>Transcription Result</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4 bg-muted rounded-md mt-1 relative">
                    <p className="whitespace-pre-wrap">{responseText || "No text transcribed"}</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {successMessage && (
        <Alert variant="default" className="border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
