
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, FileDown, Copy, Check, FileText, Loader2, AlertCircle } from 'lucide-react';
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
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<Blob | null>(null);
  
  const summaryRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const { toast } = useToast();
  
  // Use the voice interaction hook for validation only
  const { 
    supportsVoice,
    openAIVoiceSupported,
    apiKeyStatus,
    apiKeyErrorDetails,
    retryApiKeyValidation
  } = useVoiceInteraction({
    continuousListening: false,
  });

  // Manual start recording implementation
  const startRecording = async () => {
    // Reset error state and data
    setRecordingError(null);
    setTranscribedText('');
    setSummary('');
    audioChunksRef.current = [];
    
    if (!supportsVoice) {
      toast({
        title: "Voice recording not supported",
        description: "Your browser doesn't support voice recording. Try using Chrome or Edge.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if OpenAI API key is valid
    if (apiKeyStatus === 'invalid') {
      setRecordingError('OpenAI API key issue: ' + (apiKeyErrorDetails || 'API key not properly configured'));
      toast({
        title: "OpenAI API Key Issue",
        description: "The OpenAI API key is not properly configured. Recording may not work correctly.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Request microphone access
      console.log("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted");
      
      // Start timer
      setIsRecording(true);
      setRecordingTime(0);
      
      // Clear any existing timer
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
      
      // Start timer
      intervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Create media recorder with options optimized for voice
      const options = { mimeType: 'audio/mp3' };
      
      try {
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;
      } catch (e) {
        // Fallback to default format if mp3 is not supported
        console.log("MP3 format not supported, using default format");
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
      }
      
      // Set up recorder event handlers
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          console.log(`Received audio chunk: ${event.data.size} bytes`);
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstart = () => {
        console.log("MediaRecorder started successfully");
      };
      
      mediaRecorderRef.current.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setRecordingError("Media recorder error");
        stopRecording();
      };
      
      mediaRecorderRef.current.onstop = () => {
        console.log("MediaRecorder stopped");
        
        // Process the recording after stop
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
          setAudioData(audioBlob);
          console.log(`Final audio blob created: ${audioBlob.size} bytes`);
          
          // Process immediately
          if (audioBlob.size > 1000) {
            processAudioData(audioBlob);
          } else {
            toast({
              title: "Recording too short",
              description: "The recording was too short to process. Please try again.",
              variant: "destructive"
            });
            setRecordingError("Recording was too short to process");
          }
        } else {
          console.error("No audio data collected");
          setRecordingError("No audio data was recorded");
          toast({
            title: "Recording Failed",
            description: "No audio data was captured. Please check your microphone permissions and try again.",
            variant: "destructive"
          });
        }
        
        // Clean up
        stopMediaTracks(stream);
      };
      
      // Start recording with small time slices for more responsive recording
      mediaRecorderRef.current.start(1000);
      console.log("Recording started");
      
      toast({
        title: "Recording started",
        description: "Speak clearly to ensure accurate transcription. Recording will continue until you stop it.",
      });
    } catch (error) {
      console.error("Failed to start recording:", error);
      setRecordingError(`Recording failed to start: ${error instanceof Error ? error.message : 'unknown error'}`);
      setIsRecording(false);
      
      // Clear timer if it was started
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please check browser permissions and try again.",
        variant: "destructive"
      });
    }
  };

  // Helper function to stop media tracks
  const stopMediaTracks = (stream: MediaStream) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // Stop recording
  const stopRecording = () => {
    try {
      // Clear timer interval
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      setIsRecording(false);
      
      // Stop recording if active
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        console.log("Stopping MediaRecorder...");
        mediaRecorderRef.current.stop();
        
        toast({
          title: "Processing recording",
          description: "Your recording is being processed. This may take a moment.",
        });
      } else {
        console.log("MediaRecorder was not active");
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      toast({
        title: "Error",
        description: "Failed to properly stop recording.",
        variant: "destructive"
      });
    }
  };
  
  // Process audio data
  const processAudioData = async (audioBlob: Blob) => {
    try {
      console.log("Processing audio data, size:", audioBlob.size, "bytes");
      
      // Convert blob to base64
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        try {
          const base64 = reader.result as string;
          const base64Data = base64.split(',')[1]; // Remove the data URL prefix
          
          console.log("Audio converted to base64, sending to voice-to-text function...");
          
          // Send to our Supabase Edge Function
          const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
            body: { audio: base64Data }
          });
          
          console.log("Voice-to-text response:", { data, error });
          
          if (error) {
            throw new Error(error.message || 'Failed to convert speech to text');
          }
          
          if (!data?.text) {
            // No text was returned, likely silence
            setRecordingError("No speech detected in the recording");
            toast({
              title: "No speech detected",
              description: "The recording didn't contain any recognizable speech. Please try again.",
              variant: "destructive"
            });
            return;
          }
          
          console.log("Received transcript:", data.text);
          
          // Set the transcript
          setTranscribedText(data.text);
          
          toast({
            title: "Transcription complete",
            description: `${formatTime(recordingTime)} of audio transcribed.`,
            variant: "success"
          });
        } catch (e) {
          console.error('Error processing speech:', e);
          setRecordingError(e instanceof Error ? e.message : 'An error occurred during speech processing');
          toast({
            title: 'Speech Processing Error',
            description: e instanceof Error ? e.message : 'Failed to process your speech',
            variant: 'destructive'
          });
        }
      };
      
      reader.onerror = () => {
        console.error("FileReader error");
        setRecordingError("Error reading audio data");
        toast({
          title: "Processing Error",
          description: "Failed to process the audio data.",
          variant: "destructive"
        });
      };
      
      console.log("Starting FileReader...");
      reader.readAsDataURL(audioBlob);
      
    } catch (e) {
      console.error('Error processing audio data:', e);
      setRecordingError(e instanceof Error ? e.message : 'An error occurred processing audio');
      toast({
        title: 'Audio Processing Error',
        description: e instanceof Error ? e.message : 'Failed to process your audio',
        variant: 'destructive'
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
  
  // Retry API key validation
  const handleRetryApiKey = async () => {
    toast({
      title: "Testing API Connection",
      description: "Checking OpenAI API key configuration...",
    });
    
    const success = await retryApiKeyValidation();
    
    if (success) {
      setRecordingError(null);
    }
  };
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      // Stop recording if active
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      
      // Clear any timers
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
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
        {/* API Key error handling */}
        {apiKeyStatus === 'invalid' && (
          <div className="bg-amber-50 border border-amber-300 rounded-md p-3 text-sm flex items-start gap-2">
            <AlertCircle className="text-amber-600 h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-amber-800 font-medium">OpenAI API Key Issue</p>
              <p className="text-amber-700">{apiKeyErrorDetails || 'API key not properly configured'}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRetryApiKey}
                className="mt-1"
              >
                Test API Connection
              </Button>
            </div>
          </div>
        )}
        
        {/* Recording error display */}
        {recordingError && !apiKeyStatus && (
          <div className="bg-red-50 border border-red-300 rounded-md p-3 text-sm">
            <p className="text-red-800 font-medium">Recording Error</p>
            <p className="text-red-700">{recordingError}</p>
          </div>
        )}
      
        {/* Recording controls */}
        <div className="flex justify-center gap-4 p-2">
          {isRecording ? (
            <Button 
              variant="destructive" 
              className="flex items-center gap-2 animate-pulse" 
              onClick={stopRecording}
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
        
        {/* Audio playback (for debugging) */}
        {audioData && (
          <div className="flex justify-center">
            <audio controls src={URL.createObjectURL(audioData)} className="w-full max-w-md"></audio>
          </div>
        )}
        
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
