
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Play, Mic, Upload } from 'lucide-react';

export const VoiceAPITester: React.FC = () => {
  const [testMode, setTestMode] = useState<'text-to-voice' | 'voice-to-text' | 'api-key'>('text-to-voice');
  const [textInput, setTextInput] = useState('Hello, this is a test of the text to voice API.');
  const [voiceSelection, setVoiceSelection] = useState('alloy');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = React.useRef<Blob[]>([]);
  const { toast } = useToast();

  const handleTestTextToVoice = async () => {
    setIsLoading(true);
    setResult('');
    try {
      const { data, error } = await supabase.functions.invoke('ai-text-to-voice', {
        body: { text: textInput, voice: voiceSelection }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.audioContent) {
        setResult('Success! Playing audio...');
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        await audio.play();
      } else {
        setResult('No audio content returned');
      }
    } catch (error) {
      console.error('Text-to-voice test error:', error);
      setResult(`Error: ${error.message}`);
      toast({
        title: 'Test Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRecording = async () => {
    audioChunks.current = [];
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
        setAudioBlob(audioBlob);
        setIsRecording(false);
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      
      // Stop recording after 5 seconds
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 5000);
    } catch (error) {
      console.error('Recording error:', error);
      setIsRecording(false);
      toast({
        title: 'Recording Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
  };

  const handleTestVoiceToText = async () => {
    if (!audioBlob) {
      toast({
        title: 'No Audio',
        description: 'Please record audio first',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    setResult('');
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
          body: { audio: base64Audio }
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.error) {
          throw new Error(data.error);
        }

        if (data.text) {
          setResult(`Transcription: ${data.text}`);
        } else if (data.warning) {
          setResult(`Warning: ${data.warning}`);
        } else {
          setResult('No text transcribed');
        }
        
        setIsLoading(false);
      };
    } catch (error) {
      console.error('Voice-to-text test error:', error);
      setResult(`Error: ${error.message}`);
      toast({
        title: 'Test Failed',
        description: error.message,
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };

  const handleTestApiKey = async () => {
    setIsLoading(true);
    setResult('');
    try {
      // Test both functions
      const results = await Promise.all([
        supabase.functions.invoke('ai-text-to-voice', { body: { test: true } }),
        supabase.functions.invoke('ai-voice-to-text', { body: { test: true } })
      ]);

      const textToVoice = results[0];
      const voiceToText = results[1];
      
      let resultText = '';
      
      if (textToVoice.error || (textToVoice.data && textToVoice.data.error)) {
        resultText += `Text-to-Voice API: FAIL\n${textToVoice.error || textToVoice.data.error}\n\n`;
      } else {
        resultText += `Text-to-Voice API: SUCCESS\n`;
      }
      
      if (voiceToText.error || (voiceToText.data && voiceToText.data.error)) {
        resultText += `Voice-to-Text API: FAIL\n${voiceToText.error || voiceToText.data.error}`;
      } else {
        resultText += `Voice-to-Text API: SUCCESS`;
      }
      
      setResult(resultText);
    } catch (error) {
      console.error('API key test error:', error);
      setResult(`Error: ${error.message}`);
      toast({
        title: 'Test Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioBlob(file);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Voice API Tester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup 
          defaultValue="text-to-voice" 
          value={testMode} 
          onValueChange={(value) => setTestMode(value as any)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text-to-voice" id="text-to-voice" />
            <Label htmlFor="text-to-voice">Text-to-Voice</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="voice-to-text" id="voice-to-text" />
            <Label htmlFor="voice-to-text">Voice-to-Text</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="api-key" id="api-key" />
            <Label htmlFor="api-key">API Key Test</Label>
          </div>
        </RadioGroup>

        {testMode === 'text-to-voice' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="voice">Voice</Label>
              <select 
                id="voice" 
                value={voiceSelection} 
                onChange={e => setVoiceSelection(e.target.value)}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="alloy">Alloy</option>
                <option value="echo">Echo</option>
                <option value="fable">Fable</option>
                <option value="onyx">Onyx</option>
                <option value="nova">Nova</option>
                <option value="shimmer">Shimmer</option>
              </select>
            </div>
            <div>
              <Label htmlFor="text">Text to convert</Label>
              <Textarea 
                id="text" 
                value={textInput} 
                onChange={e => setTextInput(e.target.value)} 
                rows={4}
              />
            </div>
          </div>
        )}

        {testMode === 'voice-to-text' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button 
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                variant={isRecording ? "destructive" : "default"}
              >
                {isRecording ? (
                  <>Stop Recording</>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Record Audio
                  </>
                )}
              </Button>
              
              <div className="flex items-center">
                <Input 
                  type="file" 
                  accept="audio/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  id="audio-upload" 
                />
                <Label htmlFor="audio-upload" className="cursor-pointer">
                  <Button variant="outline" type="button" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Audio
                    </span>
                  </Button>
                </Label>
              </div>
            </div>
            
            {isRecording && (
              <div className="flex items-center justify-center h-12">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 bg-red-500 opacity-75 rounded-full animate-ping"></div>
                  <div className="w-8 h-8 bg-red-600 rounded-full"></div>
                </div>
              </div>
            )}
            
            {audioBlob && !isRecording && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">Audio file ready ({(audioBlob.size / 1024).toFixed(1)} KB)</p>
              </div>
            )}
          </div>
        )}

        {result && (
          <div className="p-4 bg-muted rounded-md overflow-auto max-h-40">
            <pre className="text-xs whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          disabled={isLoading || (testMode === 'voice-to-text' && !audioBlob && !isRecording)}
          onClick={() => {
            if (testMode === 'text-to-voice') handleTestTextToVoice();
            else if (testMode === 'voice-to-text') handleTestVoiceToText();
            else handleTestApiKey();
          }}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run Test
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
