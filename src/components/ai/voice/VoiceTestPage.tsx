
import React from 'react';
import { VoiceAPITester } from '../utils/VoiceAPITester';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const VoiceTestPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Voice Integration Test Center</h1>
      
      <Tabs defaultValue="test-tool">
        <TabsList>
          <TabsTrigger value="test-tool">Test Tools</TabsTrigger>
          <TabsTrigger value="help">Troubleshooting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="test-tool" className="space-y-6">
          <VoiceAPITester />
        </TabsContent>
        
        <TabsContent value="help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting OpenAI Voice Features</CardTitle>
              <CardDescription>
                Common issues and solutions for the voice integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">API Key Issues</h3>
                <p className="text-sm text-muted-foreground">
                  Ensure your OpenAI API key is set correctly in the Supabase secrets. The key should start with "sk-" and should have permissions for both audio transcription and text-to-speech.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Audio Format Issues</h3>
                <p className="text-sm text-muted-foreground">
                  OpenAI requires audio to be at least 0.1 seconds in length. If you're getting "audio too short" errors, try speaking for longer or using the file upload feature with a known good audio file.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Memory Limitations</h3>
                <p className="text-sm text-muted-foreground">
                  Edge functions have memory limits. Keep text inputs under 4000 characters and audio recordings reasonably short (under 30 seconds).
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Timeout Issues</h3>
                <p className="text-sm text-muted-foreground">
                  Edge functions have a timeout limit. If your requests are timing out, try with shorter text or audio.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Browser Support</h3>
                <p className="text-sm text-muted-foreground">
                  Make sure you're using a modern browser with Web Audio API and MediaRecorder support. Chrome, Firefox, and Edge should work well.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
