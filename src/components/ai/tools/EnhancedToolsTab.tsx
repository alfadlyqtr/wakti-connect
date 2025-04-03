import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUp, Mic, Users, FileText, Settings, Bot } from 'lucide-react';
import { AIAssistantRole } from '@/types/ai-assistant.types';
import { DocumentAnalysisToolCard } from './DocumentAnalysisToolCard';
import { VoiceInteractionToolCard } from './VoiceInteractionToolCard';
import { useSpeechSynthesis } from '@/hooks/ai/useSpeechSynthesis';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

interface EnhancedToolsTabProps {
  selectedRole: AIAssistantRole;
  onUseContent: (content: string) => void;
  canAccess: boolean;
  compact?: boolean;
}

export const EnhancedToolsTab: React.FC<EnhancedToolsTabProps> = ({
  selectedRole,
  onUseContent,
  canAccess,
  compact = false
}) => {
  const [meetingTranscript, setMeetingTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [activeToolTab, setActiveToolTab] = useState('documents');
  const { speak, cancel, speaking } = useSpeechSynthesis();
  const { toast } = useToast();
  
  const handleSpeechRecognized = (text: string) => {
    if (activeToolTab === 'meeting') {
      setMeetingTranscript(prev => prev + ' ' + text);
    } else {
      onUseContent(text);
    }
  };
  
  const startMeetingRecording = () => {
    setIsRecording(true);
    toast({
      title: "Meeting Recording Started",
      description: "Your meeting is now being transcribed. Speak clearly for best results.",
    });
    // In a real implementation, this would start speech recognition
  };
  
  const stopMeetingRecording = () => {
    setIsRecording(false);
    toast({
      title: "Meeting Recording Stopped",
      description: "Your meeting has been transcribed. You can now summarize or edit the transcript.",
    });
    // In a real implementation, this would stop speech recognition
  };
  
  const summarizeMeeting = () => {
    if (!meetingTranscript.trim()) {
      toast({
        title: "No Meeting Transcript",
        description: "Please record a meeting first or enter transcript text manually.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, this would send the transcript to an AI for summarization
    const prompt = `Please summarize the following meeting transcript:\n\n${meetingTranscript}`;
    onUseContent(prompt);
    
    toast({
      title: "Generating Meeting Summary",
      description: "Your meeting transcript is being processed. A summary will appear in the chat.",
    });
  };
  
  const downloadTranscript = () => {
    // Create a downloadable text file
    const element = document.createElement('a');
    const file = new Blob([meetingTranscript], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `meeting-transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Transcript Downloaded",
      description: "Your meeting transcript has been downloaded as a text file.",
    });
  };
  
  if (!canAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Tools</CardTitle>
          <CardDescription>
            Advanced AI tools are only available for Business and Individual plans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            Upgrade your plan to access document analysis, voice interaction, and meeting tools.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center text-sm mb-1">
          <Bot className="h-4 w-4 mr-1.5 text-wakti-blue" />
          <span className="font-medium">AI Tools</span>
        </div>
        <VoiceInteractionToolCard 
          onSpeechRecognized={handleSpeechRecognized}
          compact={true}
        />
      </div>
    );
  }
  
  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl gap-2">
          <Bot className="h-5 w-5 text-wakti-blue" />
          AI Tools
          <Badge variant="outline" className="ml-2 text-xs">Beta</Badge>
        </CardTitle>
        <CardDescription>
          Enhance your productivity with our specialized AI tools
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeToolTab} onValueChange={setActiveToolTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="documents" className="flex items-center gap-1">
              <FileUp className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-1">
              <Mic className="h-4 w-4" />
              <span>Voice</span>
            </TabsTrigger>
            <TabsTrigger value="meeting" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Meetings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="space-y-4">
            <DocumentAnalysisToolCard 
              canAccess={canAccess}
              onUseDocumentContent={onUseContent}
              selectedRole={selectedRole}
            />
          </TabsContent>
          
          <TabsContent value="voice" className="space-y-4">
            <VoiceInteractionToolCard 
              onSpeechRecognized={handleSpeechRecognized}
            />
          </TabsContent>
          
          <TabsContent value="meeting" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Meeting Assistant</CardTitle>
                <CardDescription>
                  Record, transcribe, and summarize your meetings
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-center gap-3 my-4">
                  <Button 
                    variant={isRecording ? "destructive" : "default"}
                    onClick={isRecording ? stopMeetingRecording : startMeetingRecording}
                    className="w-40"
                  >
                    {isRecording ? (
                      <>
                        <Mic className="h-4 w-4 mr-2 animate-pulse" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="meetingTranscript">Meeting Transcript</Label>
                  <Textarea 
                    id="meetingTranscript" 
                    placeholder="Your meeting transcript will appear here, or you can paste it manually..."
                    value={meetingTranscript}
                    onChange={(e) => setMeetingTranscript(e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="secondary" 
                      onClick={downloadTranscript}
                      disabled={!meetingTranscript.trim()}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Download Transcript
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={summarizeMeeting}
                    disabled={!meetingTranscript.trim()}
                  >
                    Summarize Meeting
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
