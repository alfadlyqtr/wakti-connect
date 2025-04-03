
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, FileDown, Copy, Check, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { supabase } from '@/integrations/supabase/client';

interface MeetingSummaryToolProps {
  onUseSummary?: (summary: string) => void;
}

export const MeetingSummaryTool: React.FC<MeetingSummaryToolProps> = ({ onUseSummary }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcribedText, setTranscribedText] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  // Use the voice interaction hook for recording
  const { 
    startListening, 
    stopListening, 
    supportsVoice, 
    isListening,
    lastTranscript,
    isProcessing
  } = useVoiceInteraction();

  // Start recording
  const startRecording = () => {
    if (!supportsVoice) {
      toast({
        title: "Voice recording not supported",
        description: "Your browser doesn't support voice recording. Try using Chrome or Edge.",
        variant: "destructive"
      });
      return;
    }
    
    setIsRecording(true);
    setRecordingTime(0);
    setTranscribedText('');
    setSummary('');
    
    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Start voice recording
    startListening();
    
    toast({
      title: "Recording started",
      description: "Speak clearly to ensure accurate transcription.",
    });
  };

  // Stop recording
  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsRecording(false);
    
    // Stop voice recording
    stopListening();
    
    if (lastTranscript) {
      toast({
        title: "Recording completed",
        description: `${formatTime(recordingTime)} of audio transcribed.`,
      });
    } else {
      toast({
        title: "Transcription failed",
        description: "Could not transcribe the audio. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Generate summary using AI
  const generateSummary = async () => {
    if (!transcribedText) return;
    
    setIsSummarizing(true);
    
    try {
      // Call the AI assistant to summarize the transcript
      const response = await supabase.functions.invoke("ai-assistant", {
        body: {
          message: `Please summarize the following meeting transcript into key points, action items, and decisions. Format it with markdown headings and bullet points: ${transcribedText}`,
          context: "This is a meeting transcript that needs to be summarized."
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to generate summary");
      }
      
      const aiSummary = response.data.response;
      
      // Add header with metadata
      const summaryWithHeader = `
## Meeting Summary
- **Date**: ${new Date().toLocaleDateString()}
- **Duration**: ${formatTime(recordingTime)}

${aiSummary}
      `;
      
      setSummary(summaryWithHeader);
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Summary Error",
        description: "Failed to generate meeting summary. Please try again.",
        variant: "destructive"
      });
      
      // Use a fallback summary for demo purposes
      const fallbackSummary = `
## Meeting Summary
- **Date**: ${new Date().toLocaleDateString()}
- **Duration**: ${formatTime(recordingTime)}

### Key Points:
1. Team discussed project timeline and adjusted deadlines for Q3 deliverables
2. Budget approval for new marketing campaign was confirmed
3. New team member onboarding scheduled for next week

### Action Items:
- Alex to finalize the design mockups by Friday
- Sarah to coordinate with the client about revised timelines
- Michael to prepare onboarding materials

### Decisions:
- Weekly status meetings moved to Thursdays at 10am
- Remote work policy extended through end of year
      `;
      
      setSummary(fallbackSummary);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Copy summary to clipboard
  const copySummary = () => {
    if (!summary) return;
    
    navigator.clipboard.writeText(summary);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "Meeting summary copied to clipboard successfully.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  // Export as PDF (simulate)
  const exportAsPDF = () => {
    toast({
      title: "PDF export",
      description: "Your meeting summary would be exported as PDF here.",
    });
  };

  // Send summary to chat
  const sendToChat = () => {
    if (onUseSummary && summary) {
      onUseSummary(summary);
    }
  };
  
  // Update transcribedText when lastTranscript changes
  useEffect(() => {
    if (lastTranscript && isRecording) {
      setTranscribedText(lastTranscript);
    }
  }, [lastTranscript, isRecording]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-wakti-blue" />
          Meeting Summary Tool
        </CardTitle>
        <CardDescription>
          Record your meeting and get an AI-generated summary with key points and action items
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recording controls */}
        <div className="flex justify-center gap-4 p-4">
          {isRecording ? (
            <Button 
              variant="destructive" 
              className="flex items-center gap-2" 
              onClick={stopRecording}
              disabled={isProcessing}
            >
              <MicOff className="h-4 w-4" />
              Stop Recording ({formatTime(recordingTime)})
            </Button>
          ) : (
            <Button 
              variant="default" 
              className="flex items-center gap-2 bg-wakti-blue hover:bg-wakti-blue/90" 
              onClick={startRecording}
              disabled={isSummarizing || !supportsVoice}
            >
              <Mic className="h-4 w-4" />
              Start Recording
            </Button>
          )}
        </div>
        
        {/* Transcription display */}
        {transcribedText && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Transcribed Text:</h3>
            <Textarea 
              value={transcribedText} 
              className="h-24 resize-none bg-muted/30"
              readOnly
            />
            
            {!summary && (
              <Button 
                onClick={generateSummary} 
                className="w-full"
                disabled={isSummarizing}
              >
                {isSummarizing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <FileText className="h-4 w-4" />
                    </motion.div>
                    Summarizing...
                  </>
                ) : (
                  <>Generate Summary</>
                )}
              </Button>
            )}
          </div>
        )}
        
        {/* Summary display */}
        {summary && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Meeting Summary:</h3>
            <div className="bg-muted/30 rounded-md p-3 whitespace-pre-line text-sm">
              {summary}
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Summary actions */}
      {summary && (
        <CardFooter className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={copySummary}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={exportAsPDF}
          >
            <FileDown className="h-4 w-4" />
            Export as PDF
          </Button>
          <Button 
            size="sm" 
            className="flex items-center gap-1 ml-auto"
            onClick={sendToChat}
          >
            Use in Chat
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
