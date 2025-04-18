
import { useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { formatTime } from '@/utils/audio/audioProcessing';
import { improveTranscriptionAccuracy, detectLocationFromText } from '@/utils/text/transcriptionUtils';

type MeetingSummaryState = {
  isRecording: boolean;
  recordingTime: number;
  transcribedText: string;
  summary: string;
  isSummarizing: boolean;
  recordingError: string | null;
  audioData: Blob | null;
  detectedLocation: string | null;
};

type SavedMeeting = {
  id: string;
  date: string;
  duration: number;
  location: string | null;
  summary: string;
  audioUrl?: string;
  language?: string;
};

export const useMeetingSummary = () => {
  const [state, setState] = useState<MeetingSummaryState>({
    isRecording: false,
    recordingTime: 0,
    transcribedText: '',
    summary: '',
    isSummarizing: false,
    recordingError: null,
    audioData: null,
    detectedLocation: null
  });

  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const [savedMeetings, setSavedMeetings] = useState<SavedMeeting[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [copied, setCopied] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const summaryRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();

  // Load saved meetings from Supabase
  const loadSavedMeetings = async () => {
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setSavedMeetings(data);
      } else {
        console.log("No saved meetings found");
        setSavedMeetings([]);
      }
    } catch (error) {
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

  // Start recording function
  const startRecording = async (supportsVoice: boolean, apiKeyStatus: string, apiKeyErrorDetails: string | null) => {
    setState(prev => ({
      ...prev,
      recordingError: null,
      transcribedText: '',
      summary: ''
    }));
    
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
      setState(prev => ({
        ...prev,
        recordingError: 'OpenAI API key issue: ' + (apiKeyErrorDetails || 'API key not properly configured')
      }));
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
      
      setState(prev => ({
        ...prev,
        isRecording: true,
        recordingTime: 0
      }));
      
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
      
      intervalRef.current = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          recordingTime: prev.recordingTime + 1
        }));
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
        setState(prev => ({
          ...prev,
          recordingError: "Media recorder error"
        }));
        stopRecording();
      };
      
      mediaRecorderRef.current.onstop = async () => {
        console.log("MediaRecorder stopped");
        
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
          setState(prev => ({
            ...prev,
            audioData: audioBlob
          }));
          console.log(`Final audio blob created: ${audioBlob.size} bytes`);
          
          if (audioBlob.size > 1000) {
            processAudioData(audioBlob);
          } else {
            toast({
              title: "Recording too short",
              description: "The recording was too short to process. Please try again.",
              variant: "destructive"
            });
            setState(prev => ({
              ...prev,
              recordingError: "Recording was too short to process"
            }));
          }
        } else {
          console.error("No audio data collected");
          setState(prev => ({
            ...prev,
            recordingError: "No audio data was recorded"
          }));
          toast({
            title: "Recording Failed",
            description: "No audio data was captured. Please check your microphone permissions and try again.",
            variant: "destructive"
          });
        }
        
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };
      
      mediaRecorderRef.current.start(1000);
      console.log("Recording started");
      
      toast({
        title: "Recording started",
        description: "Speak clearly to ensure accurate transcription. Recording will continue until you stop it.",
      });
    } catch (error) {
      console.error("Failed to start recording:", error);
      setState(prev => ({
        ...prev,
        recordingError: `Recording failed to start: ${error instanceof Error ? error.message : 'unknown error'}`,
        isRecording: false
      }));
      
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

  // Stop recording function
  const stopRecording = () => {
    try {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      setState(prev => ({
        ...prev,
        isRecording: false
      }));
      
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
            setState(prev => ({
              ...prev,
              recordingError: "No speech detected in the recording"
            }));
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
          
          setState(prev => ({
            ...prev,
            transcribedText: processedText
          }));
          
          toast({
            title: "Transcription complete",
            description: `${formatTime(state.recordingTime)} of audio transcribed.`,
            variant: "success"
          });
        } catch (e) {
          console.error('Error processing speech:', e);
          setState(prev => ({
            ...prev,
            recordingError: e instanceof Error ? e.message : 'An error occurred during speech processing'
          }));
          toast({
            title: 'Speech Processing Error',
            description: e instanceof Error ? e.message : 'Failed to process your speech',
            variant: 'destructive'
          });
        }
      };
      
      reader.onerror = () => {
        console.error("FileReader error");
        setState(prev => ({
          ...prev,
          recordingError: "Error reading audio data"
        }));
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
      setState(prev => ({
        ...prev,
        recordingError: e instanceof Error ? e.message : 'An error occurred processing audio'
      }));
      toast({
        title: 'Audio Processing Error',
        description: e instanceof Error ? e.message : 'Failed to process your audio',
        variant: 'destructive'
      });
    }
  };

  // Generate summary
  const generateSummary = async () => {
    if (!state.transcribedText) return;
    
    setState(prev => ({ ...prev, isSummarizing: true }));
    
    try {
      // Check for location in the transcribed text with improved detection
      const location = detectLocationFromText(state.transcribedText);
      setState(prev => ({ ...prev, detectedLocation: location }));
      
      const locationContext = location 
        ? `The meeting location has been identified as: "${location}". Please include this location information in the beginning of the summary.` 
        : "No specific location was detected in the transcript.";

      // Determine the language of the transcript
      const isArabicText = /[\u0600-\u06FF]/.test(state.transcribedText);
      const summaryLanguage = isArabicText ? 'ar' : 'en';
      
      const systemPrompt = summaryLanguage === 'ar' 
        ? "أنت مساعد محترف يقوم بتلخيص محادثات الاجتماعات. يرجى تلخيص المحادثة التالية بتنسيق نظيف مع عناوين ونقاط مرقمة. ركز على النقاط الرئيسية والقرارات والإجراءات المطلوبة. احتفظ بالملخص دقيقًا وموجزًا."
        : "You are a professional meeting summarizer. Please create a professional and comprehensive summary of the following meeting transcript, including key points, action items, decisions made, and who was participating.";

      const response = await supabase.functions.invoke("ai-assistant", {
        body: {
          message: state.transcribedText,
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
- **المدة**: ${formatTime(state.recordingTime)}
${location ? `- **الموقع**: ${location}` : ''}

${aiSummary}
        `
        : `
## Meeting Summary
- **Date**: ${dateStr}
- **Duration**: ${formatTime(state.recordingTime)}
${location ? `- **Location**: ${location}` : ''}

${aiSummary}
        `;
      
      setState(prev => ({
        ...prev,
        summary: summaryWithHeader
      }));
      
      // Save the meeting summary to Supabase
      try {
        const { error: saveError } = await supabase.from('meetings').insert({
          date: new Date().toISOString(),
          duration: state.recordingTime,
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
      
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Summary Error",
        description: "Failed to generate meeting summary. Please try again.",
        variant: "destructive"
      });
      
      // Fallback summary with location if detected
      const isArabicText = /[\u0600-\u06FF]/.test(state.transcribedText);
      const fallbackSummary = isArabicText
        ? `
## ملخص الاجتماع
- **التاريخ**: ${new Date().toLocaleDateString('ar-SA')}
- **المدة**: ${formatTime(state.recordingTime)}
${state.detectedLocation ? `- **الموقع**: ${state.detectedLocation}` : ''}

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
- **Duration**: ${formatTime(state.recordingTime)}
${state.detectedLocation ? `- **Location**: ${state.detectedLocation}` : ''}

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
      
      setState(prev => ({
        ...prev,
        summary: fallbackSummary
      }));
    } finally {
      setState(prev => ({ ...prev, isSummarizing: false }));
    }
  };

  // Copy summary to clipboard
  const copySummary = () => {
    if (!state.summary) return;
    
    navigator.clipboard.writeText(state.summary);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "Meeting summary copied to clipboard successfully.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  // Download audio recording
  const downloadAudio = () => {
    if (!state.audioData) return;
    
    setIsDownloadingAudio(true);
    
    try {
      // Create a download link for the audio file
      const url = URL.createObjectURL(state.audioData);
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

  return {
    state,
    isDownloadingAudio,
    savedMeetings,
    isLoadingHistory,
    isExporting,
    setIsExporting,
    selectedLanguage,
    setSelectedLanguage,
    copied,
    summaryRef,
    loadSavedMeetings,
    startRecording,
    stopRecording,
    generateSummary,
    copySummary,
    downloadAudio
  };
};
