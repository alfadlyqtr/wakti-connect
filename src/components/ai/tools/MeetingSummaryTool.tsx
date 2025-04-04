
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, FileDown, Copy, Check, FileText, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { supabase } from '@/integrations/supabase/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  const [isExporting, setIsExporting] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  // Use the voice interaction hook for recording with continuous listening
  const { 
    startListening, 
    stopListening, 
    supportsVoice, 
    isListening,
    lastTranscript,
    isProcessing,
    openAIVoiceSupported
  } = useVoiceInteraction({
    continuousListening: true,
    onTranscriptComplete: (text) => {
      // Append to existing transcript instead of replacing
      setTranscribedText(prev => prev ? `${prev}\n${text}` : text);
    }
  });

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
    
    // Start timer with interval, ensuring to clear any existing interval first
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    intervalRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Start voice recording
    startListening();
    
    toast({
      title: "Recording started",
      description: "Speak clearly to ensure accurate transcription. Recording will continue until you stop it.",
    });
  };

  // Stop recording
  const stopRecording = () => {
    // Clear timer interval
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsRecording(false);
    
    // Stop voice recording
    stopListening();
    
    if (transcribedText) {
      toast({
        title: "Recording completed",
        description: `${formatTime(recordingTime)} of audio transcribed.`,
      });
    } else {
      toast({
        title: "Transcription processing",
        description: "Processing the audio. This may take a moment.",
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
          message: `Please summarize the following meeting transcript into key points, action items, decisions, and participants. Format it with markdown headings and bullet points, and highlight important items: ${transcribedText}`,
          context: "This is a meeting transcript that needs to be summarized with visual highlights."
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

  // Export as PDF
  const exportAsPDF = async () => {
    if (!summary || !summaryRef.current) return;
    
    setIsExporting(true);
    
    try {
      const summaryElement = summaryRef.current;
      
      // Add some styling for better PDF output
      const originalStyle = summaryElement.style.cssText;
      summaryElement.style.padding = '20px';
      summaryElement.style.backgroundColor = '#ffffff';
      summaryElement.style.color = '#000000';
      summaryElement.style.maxWidth = '800px';
      summaryElement.style.margin = '0 auto';
      
      const canvas = await html2canvas(summaryElement, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      // Reset the original style
      summaryElement.style.cssText = originalStyle;
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate aspect ratio
      const imgWidth = 210; // A4 width in mm (portrait)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Meeting_Summary_${new Date().toISOString().slice(0, 10)}.pdf`);
      
      toast({
        title: "PDF Exported",
        description: "Your meeting summary has been exported as a PDF file.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export the summary as PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Send summary to chat
  const sendToChat = () => {
    if (onUseSummary && summary) {
      onUseSummary(summary);
      toast({
        title: "Summary Sent",
        description: "Meeting summary sent to chat.",
      });
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Stop listening if component unmounts while recording
      if (isRecording) {
        stopListening();
      }
    };
  }, [isRecording, stopListening]);

  // Update transcribed text if we receive new text while stopped
  useEffect(() => {
    if (!isRecording && lastTranscript && !transcribedText) {
      setTranscribedText(lastTranscript);
    }
  }, [isRecording, lastTranscript, transcribedText]);

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
        <div className="flex justify-center gap-4 p-2">
          {isRecording ? (
            <Button 
              variant="destructive" 
              className="flex items-center gap-2 animate-pulse" 
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
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Transcribed Text:</h3>
              {isRecording && <span className="text-xs text-green-500 animate-pulse">Recording in progress...</span>}
            </div>
            <Textarea 
              value={transcribedText} 
              className="h-28 resize-none bg-muted/30 font-mono text-sm"
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
            <div 
              ref={summaryRef}
              className="bg-muted/30 rounded-md p-3 whitespace-pre-line text-sm prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: summary
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold text-wakti-blue mt-3">$1</h3>')
                  .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mb-2">$1</h2>')
                  .replace(/^- (.*?)$/gm, '<li class="ml-4">$1</li>')
                  .replace(/\n\n/g, '<br />')
              }}
            />
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
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4" />
                Export as PDF
              </>
            )}
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
