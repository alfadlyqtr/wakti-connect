
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import { useVoiceSettings } from '@/store/voiceSettings';
import { AIVoiceVisualizer } from '@/components/ai/animation/AIVoiceVisualizer';
import { Mic, Send, Square, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { parseTaskWithAI } from '@/services/ai/aiTaskParserService';
import { toast } from '@/components/ui/use-toast';

interface VoiceToTextToolProps {
  onSendText: (text: string) => void;
}

export const VoiceToTextTool: React.FC<VoiceToTextToolProps> = ({ onSendText }) => {
  const [message, setMessage] = useState('');
  const [detectTasks, setDetectTasks] = useState(true);
  const [isProcessingTask, setIsProcessingTask] = useState(false);
  const { language, visualFeedback } = useVoiceSettings();
  
  const {
    isListening,
    transcript,
    error,
    startListening,
    stopListening
  } = useVoiceInteraction({
    onTranscriptComplete: (text) => {
      setMessage(text);
      detectTasksInText(text);
    }
  });
  
  const detectTasksInText = async (text: string) => {
    if (!detectTasks || !text) return;
    
    // Check if text seems task-related
    const taskIndicators = ['task', 'todo', 'to do', 'to-do', 'remind', 'remember', 'don\'t forget', 'need to', 'have to'];
    const lowerText = text.toLowerCase();
    
    const containsTaskIndicator = taskIndicators.some(indicator => 
      lowerText.includes(indicator)
    );
    
    if (containsTaskIndicator) {
      setIsProcessingTask(true);
      try {
        const parsedTask = await parseTaskWithAI(text);
        
        if (parsedTask && parsedTask.title) {
          toast({
            title: "Task detected",
            description: `Your voice input appears to be a task: "${parsedTask.title}"`,
            variant: "default"
          });
        }
      } catch (error) {
        console.error("Error detecting task:", error);
      } finally {
        setIsProcessingTask(false);
      }
    }
  };
  
  const handleSend = () => {
    if (message.trim()) {
      onSendText(message.trim());
      setMessage('');
    }
  };
  
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Mic className="h-4 w-4 text-wakti-blue" />
          Voice to Text
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Speech will appear here after recording..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
          />
          
          {isProcessingTask && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="flex flex-col items-center">
                <Loader2 className="h-5 w-5 animate-spin mb-2" />
                <p className="text-sm">Checking for task content...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="detect-tasks"
              checked={detectTasks}
              onCheckedChange={setDetectTasks}
            />
            <Label htmlFor="detect-tasks" className="text-sm">
              Auto-detect tasks
            </Label>
          </div>
          
          {visualFeedback && isListening && (
            <AIVoiceVisualizer isActive={isListening} />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant={isListening ? "destructive" : "secondary"}
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessingTask}
        >
          {isListening ? (
            <>
              <Square className="mr-2 h-4 w-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Start Recording ({language === 'en' ? 'English' : 'Arabic'})
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleSend}
          disabled={!message.trim() || isProcessingTask}
        >
          <Send className="mr-2 h-4 w-4" />
          Send Text
        </Button>
      </CardFooter>
    </Card>
  );
};
