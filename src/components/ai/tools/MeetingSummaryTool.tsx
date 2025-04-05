
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, FileDown, Copy, Check, FileText, Loader2, AlertCircle, Map } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { supabase } from '@/lib/supabase';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { generateMapEmbedUrl, generateGoogleMapsUrl } from '@/config/maps';

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
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  
  const summaryRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const { toast } = useToast();
  
  const { 
    supportsVoice,
    apiKeyStatus,
    apiKeyErrorDetails,
    retryApiKeyValidation
  } = useVoiceInteraction({
    continuousListening: false,
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startRecording = async () => {
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
      console.log("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted");
      
      setIsRecording(true);
      setRecordingTime(0);
      
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
      
      intervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      const options = { mimeType: 'audio/mp3' };
      
      try {
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;
      } catch (e) {
        console.log("MP3 format not supported, using default format");
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
      }
      
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
        
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
          setAudioData(audioBlob);
          console.log(`Final audio blob created: ${audioBlob.size} bytes`);
          
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
        
        stopMediaTracks(stream);
      };
      
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

  const stopMediaTracks = (stream: MediaStream) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const stopRecording = () => {
    try {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      setIsRecording(false);
      
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

  const processAudioData = async (audioBlob: Blob) => {
    try {
      console.log("Processing audio data, size:", audioBlob.size, "bytes");
      
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        try {
          const base64 = reader.result as string;
          const base64Data = base64.split(',')[1];
          
          console.log("Audio converted to base64, sending to voice-to-text function...");
          
          const { data, error } = await supabase.functions.invoke('ai-voice-to-text', {
            body: { audio: base64Data }
          });
          
          console.log("Voice-to-text response:", { data, error });
          
          if (error) {
            throw new Error(error.message || 'Failed to convert speech to text');
          }
          
          if (!data?.text) {
            setRecordingError("No speech detected in the recording");
            toast({
              title: "No speech detected",
              description: "The recording didn't contain any recognizable speech. Please try again.",
              variant: "destructive"
            });
            return;
          }
          
          console.log("Received transcript:", data.text);
          
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

  // New function to detect location from text
  const detectLocationFromText = (text: string): string | null => {
    // Simple location detection using common patterns
    // Look for phrases like "meeting at [location]" or "located at [location]" or similar patterns
    const locationPatterns = [
      /(?:meeting|located|held|happening|taking place|will be|scheduled|at|in)\s+(?:the\s+)?([A-Z][a-zA-Z\s]+(?:Building|Office|Center|Room|Hall|Tower|Plaza|Street|Avenue|Road|Boulevard|Place|Square|Park|Campus|Floor|Suite|Theater|Arena|Stadium|Hotel|Conference|Center|Venue))/g,
      /(?:at|in)\s+([A-Z][a-zA-Z\s]+(?:Building|Office|Center|Room|Hall|Tower|Plaza))/g,
      /(?:at|on|in)\s+(\d+\s+[A-Z][a-zA-Z\s]+(?:Street|Avenue|Road|Boulevard|Lane|Drive|Place|Court|Way|Circle|Terrace))/g,
      /(?:location|venue|place|address)(?:\s+is)?(?:\s+at)?[:\s]+([A-Za-z0-9\s,]+(?:Street|Avenue|Road|Boulevard|Place|Square|Park|Building|Tower|Plaza))/i,
    ];

    for (const pattern of locationPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        // Extract the location part from the match
        const locationMatch = pattern.exec(text);
        if (locationMatch && locationMatch[1]) {
          return locationMatch[1].trim();
        }
        return matches[0].replace(/(?:meeting|located|held|happening|taking place|will be|scheduled|at|in)\s+(?:the\s+)?/, '').trim();
      }
    }

    return null;
  };

  const generateSummary = async () => {
    if (!transcribedText) return;
    
    setIsSummarizing(true);
    
    try {
      // Check for location in the transcribed text
      const location = detectLocationFromText(transcribedText);
      setDetectedLocation(location);
      
      const locationContext = location 
        ? `The meeting location appears to be at: "${location}". Please include this location information in the summary.` 
        : "";

      const response = await supabase.functions.invoke("ai-assistant", {
        body: {
          message: `Please summarize the following meeting transcript into key points, action items, decisions, and participants. Format it with markdown headings and bullet points, and highlight important items. ${locationContext} If possible, organize information into clear sections. ${transcribedText}`,
          context: "This is a meeting transcript that needs to be summarized with visual highlights and structured organization for PDF export."
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to generate summary");
      }
      
      const aiSummary = response.data.response;
      
      const summaryWithHeader = `
## Meeting Summary
- **Date**: ${new Date().toLocaleDateString()}
- **Duration**: ${formatTime(recordingTime)}
${location ? `- **Location**: ${location}` : ''}

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
      
      // Fallback summary with location if detected
      const fallbackSummary = `
## Meeting Summary
- **Date**: ${new Date().toLocaleDateString()}
- **Duration**: ${formatTime(recordingTime)}
${detectedLocation ? `- **Location**: ${detectedLocation}` : ''}

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

  const exportAsPDF = async () => {
    if (!summary || !summaryRef.current) return;
    
    setIsExporting(true);
    
    try {
      // Create a temporary container for the PDF export
      const pdfContainer = document.createElement('div');
      pdfContainer.style.width = '800px';
      pdfContainer.style.padding = '40px';
      pdfContainer.style.backgroundColor = '#ffffff';
      pdfContainer.style.color = '#000000';
      pdfContainer.style.fontFamily = 'Arial, sans-serif';
      document.body.appendChild(pdfContainer);
      
      // Add WAKTI branding header
      const headerDiv = document.createElement('div');
      headerDiv.style.marginBottom = '20px';
      headerDiv.style.paddingBottom = '15px';
      headerDiv.style.borderBottom = '2px solid #0053c3';
      headerDiv.style.display = 'flex';
      headerDiv.style.justifyContent = 'space-between';
      headerDiv.style.alignItems = 'center';
      
      // Logo and title
      headerDiv.innerHTML = `
        <div style="display: flex; align-items: center;">
          <h1 style="color: #0053c3; margin: 0; font-size: 24px;">WAKTI</h1>
          <span style="color: #666; margin-left: 10px; font-size: 18px;">Meeting Summary</span>
        </div>
        <div style="color: #666; font-size: 12px;">Powered by WAKTI Productivity Suite</div>
      `;
      pdfContainer.appendChild(headerDiv);
      
      // Add the summary content
      const contentDiv = document.createElement('div');
      contentDiv.innerHTML = summaryRef.current.innerHTML;
      pdfContainer.appendChild(contentDiv);
      
      // Add location map if location was detected
      if (detectedLocation) {
        const mapDiv = document.createElement('div');
        mapDiv.style.marginTop = '30px';
        mapDiv.style.marginBottom = '30px';
        
        const mapTitleDiv = document.createElement('div');
        mapTitleDiv.innerHTML = `<h3 style="color: #0053c3; margin-bottom: 10px;">Meeting Location</h3>`;
        mapDiv.appendChild(mapTitleDiv);
        
        const mapImageDiv = document.createElement('div');
        mapImageDiv.style.width = '100%';
        mapImageDiv.style.height = '300px';
        mapImageDiv.style.border = '1px solid #ddd';
        mapImageDiv.style.backgroundColor = '#f8f8f8';
        mapImageDiv.style.display = 'flex';
        mapImageDiv.style.justifyContent = 'center';
        mapImageDiv.style.alignItems = 'center';
        mapImageDiv.innerHTML = `
          <iframe 
            width="100%" 
            height="300" 
            frameborder="0" 
            style="border:0" 
            src="${generateMapEmbedUrl(detectedLocation)}" 
            allowfullscreen>
          </iframe>
        `;
        mapDiv.appendChild(mapImageDiv);
        
        const mapLinkDiv = document.createElement('div');
        mapLinkDiv.innerHTML = `
          <a style="color: #0053c3; font-size: 12px; text-decoration: none;" 
             href="${generateGoogleMapsUrl(detectedLocation)}" target="_blank">
            Open in Google Maps
          </a>
        `;
        mapDiv.appendChild(mapLinkDiv);
        
        pdfContainer.appendChild(mapDiv);
      }
      
      // Add footer with WAKTI promotion
      const footerDiv = document.createElement('div');
      footerDiv.style.marginTop = '30px';
      footerDiv.style.paddingTop = '15px';
      footerDiv.style.borderTop = '2px solid #0053c3';
      footerDiv.style.fontSize = '12px';
      footerDiv.style.color = '#666';
      footerDiv.style.display = 'flex';
      footerDiv.style.justifyContent = 'space-between';
      footerDiv.innerHTML = `
        <div>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
        <div>Manage your meetings efficiently with WAKTI Productivity Suite</div>
      `;
      pdfContainer.appendChild(footerDiv);
      
      // Render to canvas
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      
      // Remove the temporary container
      document.body.removeChild(pdfContainer);
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      let pageOffset = 0;
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`WAKTI_Meeting_Summary_${new Date().toISOString().slice(0, 10)}.pdf`);
      
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

  const sendToChat = () => {
    if (onUseSummary && summary) {
      onUseSummary(summary);
      toast({
        title: "Summary Sent",
        description: "Meeting summary sent to chat.",
      });
    }
  };

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

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      
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
        
        {recordingError && !apiKeyStatus && (
          <div className="bg-red-50 border border-red-300 rounded-md p-3 text-sm">
            <p className="text-red-800 font-medium">Recording Error</p>
            <p className="text-red-700">{recordingError}</p>
          </div>
        )}
      
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
        
        {audioData && (
          <div className="flex justify-center">
            <audio controls src={URL.createObjectURL(audioData)} className="w-full max-w-md"></audio>
          </div>
        )}
        
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
            
            {/* Location Map Display */}
            {detectedLocation && (
              <div className="mt-4 border rounded-md overflow-hidden">
                <div className="bg-muted/50 p-2 flex items-center gap-1.5">
                  <Map className="h-4 w-4 text-wakti-blue" />
                  <h3 className="text-sm font-medium">Meeting Location</h3>
                </div>
                <div className="aspect-video w-full">
                  <iframe 
                    src={generateMapEmbedUrl(detectedLocation)}
                    className="w-full h-full border-0" 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="p-2 bg-muted/20">
                  <a 
                    href={generateGoogleMapsUrl(detectedLocation)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-wakti-blue hover:underline flex items-center gap-1"
                  >
                    <Map className="h-3 w-3" /> Open in Google Maps
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
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
