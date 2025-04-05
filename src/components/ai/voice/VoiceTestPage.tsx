
import React, { useState, useCallback } from 'react';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { useVoiceSettings } from '@/store/voiceSettings';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AIVoiceVisualizer } from '../animation/AIVoiceVisualizer';
import { AIAssistantMouthAnimation } from '../animation/AIAssistantMouthAnimation';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const VoiceTestPage = () => {
  const [testResult, setTestResult] = useState('');
  const { toast } = useToast();
  const { 
    toggleAutoSilenceDetection, 
    autoSilenceDetection 
  } = useVoiceSettings();
  
  const {
    isListening,
    transcript,
    supportsVoice,
    startListening,
    stopListening,
    apiKeyStatus
  } = useVoiceInteraction();
  
  const handleApiTest = async () => {
    try {
      const testResults = [];
      
      // Test speech recognition
      toast({
        title: "Testing voice recognition...",
        description: "Checking connection to OpenAI Speech-to-Text API"
      });
      
      const recognitionResponse = await fetch('/api/v1/ai-voice-to-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          test: true 
        })
      });
      
      const recognitionData = await recognitionResponse.json();
      if (recognitionData.success) {
        testResults.push("✅ Voice-to-Text API connection successful");
      } else {
        testResults.push(`❌ Voice-to-Text API error: ${recognitionData.error || 'Unknown error'}`);
      }
      
      // Show final results
      setTestResult(testResults.join("\n"));
      
      toast({
        title: "API Test Complete",
        description: testResults.length > 0 ? testResults[0] : "Test completed"
      });
    } catch (error) {
      console.error("API test error:", error);
      setTestResult(`Error testing APIs: ${error.message}`);
      toast({
        title: "API Test Failed",
        description: `Error connecting to APIs: ${error.message}`,
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="container max-w-3xl py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Voice Recognition Test</CardTitle>
          <CardDescription>
            Test voice-to-text recognition features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>API Connection Status</Label>
            <div className="text-sm p-3 bg-muted rounded-md">
              {apiKeyStatus === 'checking' && "Checking API connection..."}
              {apiKeyStatus === 'valid' && "✅ OpenAI API key is valid"}
              {apiKeyStatus === 'invalid' && "❌ OpenAI API key is invalid or has restricted access"}
              {apiKeyStatus === 'unknown' && "⚠️ OpenAI API key status unknown"}
            </div>
            <Button onClick={handleApiTest} variant="outline" size="sm">
              Test API Connection
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label>Voice Settings</Label>
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="silence-detection">Auto Silence Detection</Label>
                <p className="text-[0.8rem] text-muted-foreground">
                  Automatically stop listening when there's silence
                </p>
              </div>
              <Switch
                id="silence-detection"
                checked={autoSilenceDetection}
                onCheckedChange={toggleAutoSilenceDetection}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-center py-4 space-y-2">
            <div className="flex flex-col items-center gap-3">
              <AIAssistantMouthAnimation isActive={true} size="medium" />
              <AIVoiceVisualizer isActive={true} />
            </div>
          </div>
  
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Voice Recognition</Label>
              {supportsVoice ? (
                <Button 
                  size="sm" 
                  variant={isListening ? "destructive" : "outline"}
                  onClick={isListening ? stopListening : startListening}
                >
                  {isListening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                  {isListening ? "Stop Listening" : "Start Listening"}
                </Button>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Speech recognition not supported in this browser
                </span>
              )}
            </div>
            
            {isListening && (
              <div className="text-sm p-3 bg-muted rounded-md h-24 overflow-y-auto">
                <p className="font-medium">Listening...</p>
                {transcript && (
                  <p className="text-muted-foreground">{transcript}</p>
                )}
              </div>
            )}
            
            {testResult && (
              <div className="p-3 border rounded-md">
                <p className="font-medium">Result:</p>
                <p className="whitespace-pre-line">{testResult}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {supportsVoice ? (
              isListening ? "Listening active" : "Ready to listen"
            ) : (
              "Browser does not support speech recognition"
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
