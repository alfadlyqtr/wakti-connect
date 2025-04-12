import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useEnhancedVoiceInteraction, VoiceRecordingState } from '@/hooks/ai/useEnhancedVoiceInteraction';
import { Mic, Square, Send, Edit, RotateCcw, Loader2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface VoiceTranscriptionControlProps {
  onTranscriptSubmit: (text: string) => void;
  onCancel?: () => void;
  compact?: boolean;
  initialOpen?: boolean;
}

export const VoiceTranscriptionControl: React.FC<VoiceTranscriptionControlProps> = ({
  onTranscriptSubmit,
  onCancel,
  compact = false,
  initialOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [editMode, setEditMode] = useState(false);
  
  const {
    recordingState,
    transcript,
    editingTranscript,
    supportsRecording,
    startRecording,
    stopRecording,
    updateTranscript,
    acceptTranscript,
    cancelTranscript,
    retryRecording
  } = useEnhancedVoiceInteraction({
    autoStop: true,
    onTranscriptComplete: (text) => {
      // We don't auto-submit anymore, user must click "Send"
      // Just keep the transcript for editing
    }
  });
  
  // Toggle edit mode when transcript is ready
  useEffect(() => {
    if (editingTranscript) {
      setEditMode(true);
    }
  }, [editingTranscript]);
  
  // Reset state when closing
  const handleClose = () => {
    if (recordingState === 'recording') {
      stopRecording();
    }
    setIsOpen(false);
    setEditMode(false);
    if (onCancel) {
      onCancel();
    }
  };
  
  // Handle transcript submission
  const handleSubmit = () => {
    if (transcript.trim()) {
      onTranscriptSubmit(transcript);
      setIsOpen(false);
      setEditMode(false);
    }
  };
  
  if (!isOpen && !compact) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full"
        variant="outline"
        disabled={!supportsRecording}
      >
        <Mic className="mr-2 h-4 w-4" />
        Voice Input
      </Button>
    );
  }
  
  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        {recordingState === 'idle' && !transcript && (
          <Button 
            size="sm" 
            variant="outline" 
            className="flex gap-2 items-center"
            onClick={startRecording}
            disabled={!supportsRecording}
          >
            <Mic className="h-4 w-4" />
            <span>Record</span>
          </Button>
        )}
        
        {recordingState === 'recording' && (
          <Button 
            size="sm" 
            variant="destructive" 
            className="flex gap-2 items-center animate-pulse"
            onClick={stopRecording}
          >
            <Square className="h-4 w-4" />
            <span>Stop Recording</span>
          </Button>
        )}
        
        {recordingState === 'processing' && (
          <Button size="sm" variant="outline" disabled className="flex gap-2 items-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </Button>
        )}
        
        {(recordingState === 'completed' || editMode) && transcript && (
          <div className="space-y-2">
            <Textarea 
              value={transcript} 
              onChange={(e) => updateTranscript(e.target.value)} 
              className="min-h-[80px] text-sm"
              readOnly={!editMode}
            />
            
            <div className="flex gap-1 justify-end">
              {editMode ? (
                <>
                  <Button size="sm" variant="ghost" onClick={() => {
                    setEditMode(false);
                    cancelTranscript();
                  }}>
                    <X className="h-3.5 w-3.5 mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" variant="default" onClick={() => {
                    setEditMode(false);
                    handleSubmit();
                  }}>
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Use Text
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={retryRecording}>
                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                    Redo
                  </Button>
                  <Button size="sm" variant="default" onClick={handleSubmit}>
                    <Send className="h-3.5 w-3.5 mr-1" />
                    Send
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6 pb-4 space-y-4">
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            {recordingState === 'idle' && !transcript && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <Button 
                  size="lg" 
                  className="h-16 w-16 rounded-full"
                  onClick={startRecording}
                >
                  <Mic className="h-8 w-8" />
                </Button>
                <p className="text-sm text-muted-foreground">Press to start speaking</p>
              </motion.div>
            )}
            
            {recordingState === 'recording' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <Button 
                  variant="destructive" 
                  size="lg" 
                  className="h-16 w-16 rounded-full animate-pulse"
                  onClick={stopRecording}
                >
                  <Square className="h-8 w-8" />
                </Button>
                <p className="text-sm text-muted-foreground">Recording... Press to stop</p>
              </motion.div>
            )}
            
            {recordingState === 'processing' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Processing your voice...</p>
              </motion.div>
            )}
            
            {(recordingState === 'completed' || editMode) && transcript && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full space-y-4"
              >
                <div className="relative">
                  <Textarea 
                    value={transcript} 
                    onChange={(e) => updateTranscript(e.target.value)} 
                    className={cn(
                      "min-h-[120px] pr-12 transition-all",
                      editMode ? "border-primary" : "bg-muted"
                    )}
                    readOnly={!editMode}
                  />
                  
                  {!editMode && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-2 h-8 w-8"
                      onClick={() => setEditMode(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <Button variant="outline" size="sm" onClick={handleClose}>
                      Cancel
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    {editMode ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>
                          Done Editing
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" onClick={retryRecording}>
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Redo
                        </Button>
                        <Button size="sm" onClick={handleSubmit}>
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};
