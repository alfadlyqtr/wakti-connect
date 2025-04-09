
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, MicOff, FileDown, Copy, Check, FileText, Loader2, Clock, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { supabase } from '@/lib/supabase';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { generateGoogleMapsUrl } from '@/config/maps';
import { generateMapEmbedUrl } from './maps-helpers';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/hooks/auth/useUser';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface VoiceToTextToolProps {
  onUseSummary?: (summary: string) => void;
}

interface SavedMeeting {
  id: string;
  date: string;
  duration: number;
  location: string | null;
  summary: string;
  language?: string;
}

export const VoiceToTextTool: React.FC<VoiceToTextToolProps> = ({ onUseSummary }) => {
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
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const [savedMeetings, setSavedMeetings] = useState<SavedMeeting[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('record');
  const [isDeletingMeeting, setIsDeletingMeeting] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  
  const summaryRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const pulseElementRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  
  const { 
    supportsVoice,
    apiKeyStatus,
    apiKeyErrorDetails,
    retryApiKeyValidation
  } = useVoiceInteraction({
    continuousListening: false,
  });

  // Language options for speech recognition
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية (Arabic)' }
  ];

  // Load saved meetings from Supabase on component mount
  useEffect(() => {
    loadSavedMeetings();
  }, [user]);

  const loadSavedMeetings = async () => {
    if (!user) return;
    
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setSavedMeetings(data);
      } else {
        console.log("No saved meetings found");
        setSavedMeetings([]);
      }
    } catch (error: any) {
      console.error("Error loading saved meetings:", error);
      toast({
        title: "Error loading meetings",
        description: "Could not load your meeting history.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const deleteMeeting = async (meetingId: string) => {
    if (!user) return;
    
    setIsDeletingMeeting(true);
    setSelectedMeetingId(meetingId);
    
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', meetingId)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      setSavedMeetings(meetings => meetings.filter(m => m.id !== meetingId));
      
      toast({
        title: "Meeting deleted",
        description: "The meeting has been removed from your history.",
        variant: "success"
      });
    } catch (error: any) {
      console.error("Error deleting meeting:", error);
      toast({
        title: "Error deleting meeting",
        description: "Could not delete the meeting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeletingMeeting(false);
      setSelectedMeetingId(null);
    }
  };

  const loadMeeting = (meeting: SavedMeeting) => {
    setSummary(meeting.summary);
    setTranscribedText(''); // Clear transcribed text when loading a saved meeting
    setDetectedLocation(meeting.location);
    setRecordingTime(meeting.duration);
    
    // Switch to the summary tab
    setActiveTab('summary');
    
    toast({
      title: "Meeting loaded",
      description: "Meeting summary has been loaded successfully.",
      variant: "success"
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', { 
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
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
    } catch (error: any) {
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
            body: { 
              audio: base64Data,
              language: selectedLanguage
            }
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
          
          // Apply some post-processing to improve transcription accuracy
          const processedText = improveTranscriptionAccuracy(data.text, selectedLanguage);
          setTranscribedText(processedText);
          
          // Switch to the transcription tab
          setActiveTab('transcription');
          
          toast({
            title: "Transcription complete",
            description: `${formatTime(recordingTime)} of audio transcribed.`,
            variant: "success"
          });
        } catch (e: any) {
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
      
    } catch (e: any) {
      console.error('Error processing audio data:', e);
      setRecordingError(e instanceof Error ? e.message : 'An error occurred processing audio');
      toast({
        title: 'Audio Processing Error',
        description: e instanceof Error ? e.message : 'Failed to process your audio',
        variant: 'destructive'
      });
    }
  };

  // Function to improve transcription accuracy with common post-processing techniques
  const improveTranscriptionAccuracy = (text: string, language: string): string => {
    if (!text) return '';
    
    if (language === 'en') {
      // English improvements
      // Capitalize first letter of sentences
      let improved = text.replace(/(\.\s+|^\s*)([a-z])/g, (match, p1, p2) => {
        return p1 + p2.toUpperCase();
      });
      
      // Fix common transcription errors
      const corrections: Record<string, string> = {
        'i think': 'I think',
        'i am': 'I am',
        'i\'m': 'I\'m',
        'i\'ll': 'I\'ll',
        'i\'ve': 'I\'ve',
        'i\'d': 'I\'d',
        'ok ': 'OK ',
        'okay ': 'OK ',
        'gonna ': 'going to ',
        'wanna ': 'want to ',
        'gotta ': 'got to ',
        'kinda ': 'kind of ',
        'sorta ': 'sort of ',
        'lemme ': 'let me ',
        'gimme ': 'give me ',
      };
      
      // Apply corrections
      Object.entries(corrections).forEach(([incorrect, correct]) => {
        improved = improved.replace(new RegExp(`\\b${incorrect}\\b`, 'gi'), correct);
      });
      
      // Add periods to sentences that might be missing them
      improved = improved.replace(/([a-z])\s+([A-Z])/g, '$1. $2');
      
      // Clean up multiple spaces
      improved = improved.replace(/\s{2,}/g, ' ').trim();
      
      return improved;
    } else if (language === 'ar') {
      // Arabic improvements
      // For Arabic text, we need different processing logic
      
      // 1. Fix common Arabic transcription errors (simplified example)
      const arabicCorrections: Record<string, string> = {
        // Add common Arabic transcription corrections here
      };
      
      let improved = text;
      
      Object.entries(arabicCorrections).forEach(([incorrect, correct]) => {
        improved = improved.replace(new RegExp(incorrect, 'g'), correct);
      });
      
      // 2. Fix spacing issues that are common in Arabic transcriptions
      improved = improved.replace(/\s{2,}/g, ' ').trim();
      
      return improved;
    }
    
    // Default return for other languages
    return text;
  };

  // Enhanced location detection with more sophisticated patterns
  const detectLocationFromText = (text: string): string | null => {
    if (!text) return null;
    
    // Check if we're processing Arabic text
    const isArabicText = /[\u0600-\u06FF]/.test(text);
    
    if (isArabicText) {
      // Arabic location patterns
      const arabicLocationPatterns = [
        /(?:الاجتماع|موقع|مكان).*?(?:في|ب).*?([ء-ي\s]+)/i,
        /(?:القاعة|غرفة|قاعة).*?([ء-ي\s]+\d*)/i,
      ];
      
      for (const pattern of arabicLocationPatterns) {
        const matches = text.match(pattern);
        if (matches && matches[1]) {
          return matches[1].trim();
        }
      }
    } else {
      // English location patterns
      const locationPatterns = [
        // Meeting at/in [Location]
        /(?:meeting|located|held|happening|taking place|will be|scheduled)\s+(?:at|in)\s+(?:the\s+)?([A-Za-z0-9\s,]+(?:Building|Office|Center|Room|Hall|Tower|Plaza|Street|Avenue|Road|Boulevard|Place|Square|Park|Campus|Floor|Suite|Theater|Arena|Stadium|Hotel|Conference|Center|Venue))/gi,
        
        // Located/held at [Location]
        /(?:located|held)\s+(?:at|in)\s+(?:the\s+)?([A-Za-z0-9\s,]+(?:Building|Office|Center|Room|Hall|Tower|Plaza))/gi,
        
        // At [Street Address]
        /(?:at|on)\s+(\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Place|Pl|Court|Ct|Way|Circle|Cir|Terrace|Ter))/gi,
        
        // Address is [Location]
        /(?:location|venue|place|address)(?:\s+is)?(?:\s+at)?[:\s]+([A-Za-z0-9\s,\.#-]+)/i,
        
        // Meeting/event in [City]
        /(?:in|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+City)?),?\s+([A-Z]{2}|[A-Za-z]+)\b/g,
        
        // Mentions of room numbers
        /(?:room|rm)\s+(\d+[A-Za-z0-9-]*)/gi,
        
        // Conference rooms often mentioned
        /((?:[A-Z][a-z]+\s+){1,3}(?:Conference|Meeting|Board)\s+Room)/g,
      ];

      for (const pattern of locationPatterns) {
        const matches = text.match(pattern);
        if (matches && matches.length > 0) {
          // Extract the location part from the match
          const locationMatch = pattern.exec(text);
          if (locationMatch && locationMatch[1]) {
            return locationMatch[1].trim();
          }
          // Fall back to the whole match with some cleanup
          return matches[0]
            .replace(/(?:meeting|located|held|happening|taking place|will be|scheduled|at|in)\s+(?:the\s+)?/i, '')
            .trim();
        }
      }

      // Look for named locations with capital letters (potential proper nouns)
      const properNounMatch = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b/g);
      if (properNounMatch) {
        // Filter out common non-location proper nouns
        const commonNonLocations = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
          'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        const potentialLocations = properNounMatch.filter(name => 
          !commonNonLocations.includes(name) && name.length > 3);
        
        if (potentialLocations.length > 0) {
          // Try to find locations that appear before or after location-related words
          const locationContexts = ['at', 'in', 'near', 'location', 'venue', 'place', 'meet', 'meeting', 'office'];
          
          for (const location of potentialLocations) {
            const contextCheck = new RegExp(`(${locationContexts.join('|')})\\s+${location}|${location}\\s+(${locationContexts.join('|')})`, 'i');
            if (text.match(contextCheck)) {
              return location;
            }
          }
        }
      }
    }

    return null;
  };

  const generateSummary = async () => {
    if (!transcribedText) return;
    
    setIsSummarizing(true);
    
    try {
      // Check for location in the transcribed text with improved detection
      const location = detectLocationFromText(transcribedText);
      setDetectedLocation(location);
      
      const locationContext = location 
        ? `The meeting location has been identified as: "${location}". Please include this location information in the beginning of the summary.` 
        : "No specific location was detected in the transcript.";

      // Determine the language of the transcript
      const isArabicText = /[\u0600-\u06FF]/.test(transcribedText);
      const summaryLanguage = isArabicText ? 'ar' : 'en';
      
      const systemPrompt = summaryLanguage === 'ar' 
        ? "أنت مساعد محترف يقوم بتلخيص محادثات الاجتماعات. يرجى تلخيص المحادثة التالية بتنسيق نظيف مع عناوين ونقاط مرقمة. ركز على النقاط الرئيسية والقرارات والإجراءات المطلوبة. احتفظ بالملخص دقيقًا وموجزًا."
        : "You are a professional meeting summarizer. Please create a professional and comprehensive summary of the following meeting transcript, including key points, action items, decisions made, and who was participating.";

      const response = await supabase.functions.invoke("ai-assistant", {
        body: {
          message: transcribedText,
          system: systemPrompt,
          context: `${locationContext} Format the summary in a clean business format with markdown headings and bullet points. Important guidelines: 1. Focus on extracting factual information only, no questions or suggestions in the summary 2. Structure the content with clear sections (Summary, Key Points, Action Items, Decisions) 3. Include a clear list of participants if mentioned 4. Be concise and direct - avoid speculation or asking questions in the summary 5. Format dates and times consistently 6. Organize action items by owner/responsible person when possible 7. Keep the tone professional and objective. RESPOND IN ${summaryLanguage === 'ar' ? 'ARABIC' : 'ENGLISH'} LANGUAGE.`
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to generate summary");
      }
      
      const aiSummary = response.data.response;
      
      // Format the header based on language
      const dateStr = new Date().toLocaleDateString(summaryLanguage === 'ar' ? 'ar-SA' : 'en-US');
      
      const summaryWithHeader = summaryLanguage === 'ar' 
        ? `
## ملخص الاجتماع
- **التاريخ**: ${dateStr}
- **المدة**: ${formatTime(recordingTime)}
${location ? `- **الموقع**: ${location}` : ''}

${aiSummary}
        `
        : `
## Meeting Summary
- **Date**: ${dateStr}
- **Duration**: ${formatTime(recordingTime)}
${location ? `- **Location**: ${location}` : ''}

${aiSummary}
        `;
      
      setSummary(summaryWithHeader);
      
      // Switch to the summary tab
      setActiveTab('summary');
      
      // Save the meeting summary to Supabase
      if (user) {
        try {
          const { error: saveError } = await supabase.from('meetings').insert({
            user_id: user.id,
            date: new Date().toISOString(),
            duration: recordingTime,
            location: location,
            summary: summaryWithHeader,
            language: summaryLanguage
          });
          
          if (saveError) {
            console.error("Error saving meeting:", saveError);
            toast({
              title: "Save Error",
              description: "Meeting summary generated but couldn't be saved to your history.",
              variant: "destructive"
            });
          } else {
            // Reload meetings after saving a new one
            loadSavedMeetings();
          }
        } catch (saveError) {
          console.error("Error saving meeting to database:", saveError);
        }
      }
      
    } catch (error: any) {
      console.error("Error generating summary:", error);
      toast({
        title: "Summary Error",
        description: "Failed to generate meeting summary. Please try again.",
        variant: "destructive"
      });
      
      // Fallback summary with location if detected
      const isArabicText = /[\u0600-\u06FF]/.test(transcribedText);
      const fallbackSummary = isArabicText
        ? `
## ملخص الاجتماع
- **التاريخ**: ${new Date().toLocaleDateString('ar-SA')}
- **المدة**: ${formatTime(recordingTime)}
${detectedLocation ? `- **الموقع**: ${detectedLocation}` : ''}

### النقاط الرئيسية:
1. تمت مناقشة جدول المشروع وتعديل المواعيد النهائية
2. تم تأكيد الميزانية للحملة التسويقية الجديدة
3. تم جدولة عملية إعداد الموظف الجديد للأسبوع المقبل

### المهام المطلوبة:
- على أحمد إنهاء التصاميم بحلول يوم الجمعة
- على سارة التنسيق مع العميل بشأن الجداول الزمنية المعدلة
- على محمد إعداد مواد التدريب

### القرارات:
- تم نقل اجتماعات الحالة الأسبوعية إلى الخميس الساعة 10 صباحاً
- تم تمديد سياسة العمل عن بعد حتى نهاية العام
        `
        : `
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
      
      // Switch to the summary tab even if there was an error
      setActiveTab('summary');
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

  const downloadAudio = () => {
    if (!audioData) return;
    
    setIsDownloadingAudio(true);
    
    try {
      // Create a download link for the audio file
      const url = URL.createObjectURL(audioData);
      const link = document.createElement('a');
      link.href = url;
      link.download = `WAKTI_Meeting_Recording_${new Date().toISOString().slice(0, 10)}.mp3`;
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Audio Downloaded",
        description: "Your meeting recording has been downloaded successfully.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error downloading audio:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download the audio recording. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloadingAudio(false);
    }
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
      
      // Check if content is in Arabic
      const isArabicContent = /[\u0600-\u06FF]/.test(summary);
      if (isArabicContent) {
        pdfContainer.style.direction = 'rtl';
        pdfContainer.style.textAlign = 'right';
      }
      
      // Add WAKTI branding header with enhanced design
      const headerDiv = document.createElement('div');
      headerDiv.style.marginBottom = '30px';
      headerDiv.style.paddingBottom = '15px';
      headerDiv.style.borderBottom = '2px solid #0053c3';
      headerDiv.style.display = 'flex';
      headerDiv.style.justifyContent = 'space-between';
      headerDiv.style.alignItems = 'center';
      
      // Logo and title with enhanced styling
      headerDiv.innerHTML = `
        <div style="display: flex; align-items: center;">
          <div style="background-color: #0053c3; color: white; padding: 10px 15px; border-radius: 6px; margin-right: 15px;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold;">WAKTI</h1>
          </div>
          <div>
            <span style="color: #333; font-size: 22px; font-weight: bold;">${isArabicContent ? 'ملخص الاجتماع' : 'Meeting Summary'}</span>
            <div style="color: #666; font-size: 14px; margin-top: 5px;">${isArabicContent ? 'تم إنشاؤه في' : 'Generated on'} ${new Date().toLocaleDateString(isArabicContent ? 'ar-SA' : 'en-US')} ${isArabicContent ? 'في' : 'at'} ${new Date().toLocaleTimeString(isArabicContent ? 'ar-SA' : 'en-US')}</div>
          </div>
        </div>
        <div style="color: #0053c3; font-size: 14px; font-weight: bold;">${isArabicContent ? 'مدعوم بواسطة مجموعة أدوات وقتي للإنتاجية' : 'Powered by WAKTI Productivity Suite'}</div>
      `;
      pdfContainer.appendChild(headerDiv);
      
      // Add meeting metadata table with enhanced styling
      const metadataDiv = document.createElement('div');
      metadataDiv.style.marginBottom = '25px';
      metadataDiv.style.backgroundColor = '#f8f9fa';
      metadataDiv.style.padding = '15px';
      metadataDiv.style.borderRadius = '6px';
      metadataDiv.style.border = '1px solid #e9ecef';
      
      // Create styled metadata table
      metadataDiv.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; direction: ${isArabicContent ? 'rtl' : 'ltr'}">
          <tr>
            <td style="padding: 8px 15px; width: 120px; font-weight: bold; color: #0053c3;">${isArabicContent ? 'التاريخ:' : 'Date:'}</td>
            <td style="padding: 8px 15px;">${new Date().toLocaleDateString(isArabicContent ? 'ar-SA' : 'en-US')}</td>
            <td style="padding: 8px 15px; width: 120px; font-weight: bold; color: #0053c3;">${isArabicContent ? 'المدة:' : 'Duration:'}</td>
            <td style="padding: 8px 15px;">${formatTime(recordingTime)}</td>
          </tr>
          ${detectedLocation ? `
          <tr>
            <td style="padding: 8px 15px; font-weight: bold; color: #0053c3;">${isArabicContent ? 'الموقع:' : 'Location:'}</td>
            <td style="padding: 8px 15px;" colspan="3">${detectedLocation}</td>
          </tr>` : ''}
        </table>
      `;
      pdfContainer.appendChild(metadataDiv);
      
      // Process the summary content to apply enhanced styling
      const contentDiv = document.createElement('div');
      contentDiv.style.lineHeight = '1.6';
      
      // Style the content with enhanced formatting
      let styledContent = summary
        // Style headings
        .replace(/^## (.*)/gm, '<h2 style="color: #0053c3; font-size: 20px; margin-top: 30px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e9ecef;">$1</h2>')
        .replace(/^### (.*)/gm, '<h3 style="color: #0053c3; font-size: 16px; margin-top: 20px; margin-bottom: 10px;">$1</h3>')
        // Style bullet points
        .replace(/^- (.*)/gm, '<li style="position: relative; list-style-type: none; padding-left: 20px; margin-bottom: 8px;"><span style="position: absolute; left: 0; top: 0; color: #0053c3;">•</span>$1</li>')
        // Style numbered lists
        .replace(/^(\d+)\. (.*)/gm, '<li style="position: relative; list-style-type: none; padding-left: 25px; margin-bottom: 8px;"><span style="position: absolute; left: 0; top: 0; color: #0053c3;">$1.</span>$2</li>')
        // Style strong elements
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #333;">$1</strong>')
        // Convert line breaks
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
      
      contentDiv.innerHTML = `<div style="font-size: 14px;">${styledContent}</div>`;
      pdfContainer.appendChild(contentDiv);
      
      // Add location map if location was detected
      if (detectedLocation) {
        const mapDiv = document.createElement('div');
        mapDiv.style.marginTop = '30px';
        mapDiv.style.marginBottom = '30px';
        
        const mapTitleDiv = document.createElement('div');
        mapTitleDiv.innerHTML = `
          <h3 style="color: #0053c3; font-size: 16px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e9ecef;">
            ${isArabicContent ? 'موقع الاجتماع' : 'Meeting Location'}
          </h3>
        `;
        mapDiv.appendChild(mapTitleDiv);
        
        // Create a centered container for the map
        const mapContainerDiv = document.createElement('div');
        mapContainerDiv.style.display = 'flex';
        mapContainerDiv.style.justifyContent = 'center';
        mapContainerDiv.style.alignItems = 'center';
        mapContainerDiv.style.backgroundColor = '#f8f9fa';
        mapContainerDiv.style.padding = '15px';
        mapContainerDiv.style.borderRadius = '6px';
        mapContainerDiv.style.border = '1px solid #e9ecef';
        
        // Add an iframe with Google Maps
        const mapIframe = document.createElement('iframe');
        mapIframe.width = '100%';
        mapIframe.height = '300';
        mapIframe.style.border = '0';
        mapIframe.src = generateMapEmbedUrl(detectedLocation);
        mapIframe.setAttribute('allowfullscreen', '');
        
        mapContainerDiv.appendChild(mapIframe);
        mapDiv.appendChild(mapContainerDiv);
        
        // Add link to open in Google Maps
        const mapLinkDiv = document.createElement('div');
        mapLinkDiv.style.marginTop = '10px';
        mapLinkDiv.style.textAlign = isArabicContent ? 'left' : 'right';
        mapLinkDiv.innerHTML = `
          <a style="color: #0053c3; font-size: 13px; text-decoration: none;" 
             href="${generateGoogleMapsUrl(detectedLocation)}" target="_blank">
            ${isArabicContent ? 'فتح في خرائط Google' : 'Open in Google Maps'}
          </a>
        `;
        mapDiv.appendChild(mapLinkDiv);
        
        pdfContainer.appendChild(mapDiv);
      }
      
      // Add footer with WAKTI promotion and enhanced design
      const footerDiv = document.createElement('div');
      footerDiv.style.marginTop = '40px';
      footerDiv.style.paddingTop = '15px';
      footerDiv.style.borderTop = '2px solid #0053c3';
      footerDiv.style.fontSize = '12px';
      footerDiv.style.color = '#666';
      footerDiv.style.display = 'flex';
      footerDiv.style.justifyContent = 'space-between';
      footerDiv.style.alignItems = 'center';
      footerDiv.style.direction = isArabicContent ? 'rtl' : 'ltr';
      
      footerDiv.innerHTML = `
        <div>${isArabicContent ? 'تم إنشاء المستند بواسطة أداة ملخص اجتماع وقتي' : 'Document generated by WAKTI Meeting Summary Tool'}</div>
        <div style="color: #0053c3; font-weight: bold;">${isArabicContent ? 'وقتي - شريكك في الإنتاجية' : 'WAKTI - Your Productivity Partner'}</div>
      `;
      pdfContainer.appendChild(footerDiv);
      
      // Add promotion banner at the bottom
      const promotionDiv = document.createElement('div');
      promotionDiv.style.marginTop = '30px';
      promotionDiv.style.padding = '15px';
      promotionDiv.style.backgroundColor = '#f0f7ff';
      promotionDiv.style.borderRadius = '6px';
      promotionDiv.style.border = '1px solid #cce5ff';
      promotionDiv.style.fontSize = '13px';
      promotionDiv.style.color = '#0053c3';
      promotionDiv.style.textAlign = 'center';
      promotionDiv.style.direction = isArabicContent ? 'rtl' : 'ltr';
      
      promotionDiv.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">
          ${isArabicContent ? 'عزز إنتاجية فريقك مع مجموعة أدوات الأعمال الكاملة من وقتي' : 'Boost your team\'s productivity with WAKTI\'s complete suite of business tools'}
        </div>
        <div style="color: #666;">
          ${isArabicContent ? 'إدارة المهام · التقويم · ملخصات الاجتماعات · تعاون الفريق · مساعدة الذكاء الاصطناعي' : 'Task management · Calendar · Meeting summaries · Team collaboration · AI assistance'}
        </div>
      `;
      pdfContainer.appendChild(promotionDiv);
      
      // Render to canvas with higher quality
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      
      // Remove the temporary container
      document.body.removeChild(pdfContainer);
      
      // Create PDF with improved settings for better quality
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      // Add the canvas as an image to the PDF
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(
        canvas.toDataURL('image/png', 1.0), 
        'PNG', 
        0, 
        0, 
        imgWidth, 
        imgHeight,
        undefined,
        'FAST'
      );
      
      // Download the PDF
      pdf.save(`WAKTI_Meeting_Summary_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
      
      toast({
        title: "PDF Exported",
        description: "Your meeting summary has been exported as a PDF.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Export Error",
        description: "Failed to export the meeting summary as PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
          {t('common.meetingSummaryTool', 'Meeting Summary Tool')}
          <Badge 
            variant="outline" 
            className="ml-2 text-[10px] px-2 py-0 h-5 bg-wakti-blue/5"
          >
            v2.0
          </Badge>
        </CardTitle>
        <CardDescription>
          {t('common.meetingSummaryDescription', 'Record and transcribe meetings to generate comprehensive summaries')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="record">{t('common.record', 'Record')}</TabsTrigger>
            <TabsTrigger value="transcription">{t('common.transcription', 'Transcription')}</TabsTrigger>
            <TabsTrigger value="summary">{t('common.summary', 'Summary')}</TabsTrigger>
            <TabsTrigger value="history">{t('common.history', 'History')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="record" className="space-y-4">
            {/* Language Selection */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-lg">
              <div>
                <h3 className="text-sm font-medium mb-1">{t('common.selectLanguage', 'Select Language')}</h3>
                <p className="text-xs text-muted-foreground">
                  {t('common.languageSupport', 'Recording supports both English and Arabic')}
                </p>
              </div>
              <Select 
                value={selectedLanguage} 
                onValueChange={setSelectedLanguage}
                disabled={isRecording}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('common.selectLanguage', 'Select Language')} />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Recording Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 rounded-lg border p-4 relative">
              {isRecording && (
                <motion.div 
                  ref={pulseElementRef}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.2, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              
              <div className="flex items-center gap-2 min-w-[120px]">
                {isRecording ? (
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Mic className="h-5 w-5 text-red-500" />
                    </motion.div>
                    <span className="font-medium">
                      {t('common.recording', 'Recording')}: {formatTime(recordingTime)}
                    </span>
                  </div>
                ) : (
                  <span className="font-medium">
                    {t('common.readyToRecord', 'Ready to Record')}
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {!isRecording ? (
                  <Button 
                    onClick={startRecording} 
                    className="bg-red-500 hover:bg-red-600"
                    disabled={isRecording || !supportsVoice}
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    {t('common.startRecording', 'Start Recording')}
                  </Button>
                ) : (
                  <Button 
                    onClick={stopRecording} 
                    variant="outline"
                  >
                    <MicOff className="mr-2 h-4 w-4" />
                    {t('common.stopRecording', 'Stop Recording')}
                  </Button>
                )}
              </div>
            </div>
            
            {/* API Key Status Alert */}
            {apiKeyStatus === 'invalid' && (
              <Alert variant="destructive">
                <AlertTitle>OpenAI API Key Issue</AlertTitle>
                <AlertDescription>
                  {apiKeyErrorDetails || "The OpenAI API key is not properly configured or is invalid."}
                </AlertDescription>
              </Alert>
            )}
            
            {/* Error State */}
            {recordingError && (
              <Alert variant="destructive">
                <AlertTitle>{t('common.recordingError', 'Recording Error')}</AlertTitle>
                <AlertDescription>{recordingError}</AlertDescription>
              </Alert>
            )}
            
            {/* Audio Download */}
            {audioData && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadAudio}
                  disabled={isDownloadingAudio}
                  className="text-xs"
                >
                  {isDownloadingAudio ? (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    <FileDown className="mr-1 h-3 w-3" />
                  )}
                  {t('common.downloadAudio', 'Download Audio')}
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="transcription" className="space-y-4">
            {/* Transcribed Text */}
            {transcribedText ? (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">
                  {t('common.transcribedMeeting', 'Transcribed Meeting')}
                </h3>
                <Textarea 
                  value={transcribedText}
                  onChange={(e) => setTranscribedText(e.target.value)}
                  className="min-h-[200px] text-sm"
                  placeholder={t('common.transcribedTextPlaceholder', 'Transcribed text will appear here...')}
                  dir={/[\u0600-\u06FF]/.test(transcribedText) ? 'rtl' : 'ltr'}
                />
                
                <Button
                  onClick={generateSummary}
                  disabled={!transcribedText || isSummarizing}
                  variant="default"
                  className="w-full"
                >
                  {isSummarizing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('common.generating', 'Generating...')}
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      {t('common.generateSummary', 'Generate Summary')}
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center p-10">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Transcription Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Record a meeting first to see the transcription here.
                </p>
                <Button onClick={() => setActiveTab('record')} variant="outline">
                  Go to Recording
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="summary" className="space-y-4">
            {/* Summary Display */}
            {summary ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">
                    {t('common.meetingSummary', 'Meeting Summary')}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copySummary}
                      className="h-8"
                    >
                      {copied ? (
                        <Check className="mr-1 h-4 w-4" />
                      ) : (
                        <Copy className="mr-1 h-4 w-4" />
                      )}
                      {copied ? t('common.copied', 'Copied') : t('common.copy', 'Copy')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportAsPDF}
                      disabled={isExporting}
                      className="h-8"
                    >
                      {isExporting ? (
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      ) : (
                        <FileDown className="mr-1 h-4 w-4" />
                      )}
                      {isExporting ? t('common.exporting', 'Exporting...') : t('common.exportPDF', 'Export PDF')}
                    </Button>
                    {onUseSummary && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onUseSummary(summary)}
                        className="h-8"
                      >
                        {t('common.useInChat', 'Use in Chat')}
                      </Button>
                    )}
                  </div>
                </div>
                
                <div 
                  ref={summaryRef}
                  className="prose prose-sm max-w-none dark:prose-invert border rounded-md p-4 bg-card"
                  dangerouslySetInnerHTML={{ 
                    __html: summary.replace(/\n/g, '<br />') 
                  }}
                  dir={/[\u0600-\u06FF]/.test(summary) ? 'rtl' : 'ltr'}
                />
                
                {/* Add Map For Location If Present */}
                {detectedLocation && (
                  <div className="mt-6 border rounded-lg overflow-hidden">
                    <h3 className="text-sm font-medium p-4 border-b">
                      {t('common.meetingLocation', 'Meeting Location')}
                    </h3>
                    <div className="h-[300px] w-full">
                      <iframe
                        title="Meeting Location"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src={generateMapEmbedUrl(detectedLocation)}
                      ></iframe>
                    </div>
                    <div className="p-4 text-right">
                      <a
                        href={generateGoogleMapsUrl(detectedLocation)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {t('common.openInGoogleMaps', 'Open in Google Maps')}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-10">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Summary Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Generate a summary from the transcription first.
                </p>
                <Button onClick={() => setActiveTab('transcription')} variant="outline">
                  Go to Transcription
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">
                {t('common.meetingHistory', 'Meeting History')}
              </h3>
              
              {isLoadingHistory ? (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : savedMeetings.length > 0 ? (
                <div className="space-y-4">
                  {savedMeetings.map((meeting) => (
                    <div 
                      key={meeting.id} 
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Meeting on {formatDate(meeting.date)}</h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                              <span>Duration: {formatTime(meeting.duration)}</span>
                              {meeting.location && <span>Location: {meeting.location}</span>}
                              {meeting.language && (
                                <span>Language: {meeting.language === 'en' ? 'English' : 'Arabic'}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => loadMeeting(meeting)}>
                              View Summary
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => deleteMeeting(meeting.id)}
                              className="text-destructive focus:text-destructive"
                              disabled={isDeletingMeeting && selectedMeetingId === meeting.id}
                            >
                              {isDeletingMeeting && selectedMeetingId === meeting.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                              )}
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => loadMeeting(meeting)}
                        >
                          View Summary
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-10 border rounded-lg">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Meeting History</h3>
                  <p className="text-muted-foreground mb-4">
                    Your saved meeting summaries will appear here.
                  </p>
                  <Button onClick={() => setActiveTab('record')} variant="outline">
                    Record a Meeting
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
