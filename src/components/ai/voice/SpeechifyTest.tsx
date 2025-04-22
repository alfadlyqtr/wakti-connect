
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { playTextWithSpeechify, stopCurrentAudio } from '@/utils/speechify';
import { toast } from 'sonner';

export const SpeechifyTest = () => {
  const [englishText, setEnglishText] = useState("Hello, this is a test message in English.");
  const [arabicText, setArabicText] = useState("مرحباً، هذا اختبار باللغة العربية");
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async (text: string) => {
    try {
      setIsPlaying(true);
      await playTextWithSpeechify({ text });
      toast.success('Audio played successfully');
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Failed to play audio. Please check the console for details.');
    } finally {
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    stopCurrentAudio();
    setIsPlaying(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Speechify Integration Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">English Text Test</h3>
          <div className="flex gap-2">
            <Input
              value={englishText}
              onChange={(e) => setEnglishText(e.target.value)}
              placeholder="Enter English text..."
            />
            <Button 
              onClick={() => handlePlay(englishText)}
              disabled={isPlaying}
            >
              Test English
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Arabic Text Test</h3>
          <div className="flex gap-2">
            <Input
              value={arabicText}
              onChange={(e) => setArabicText(e.target.value)}
              dir="rtl"
              className="text-right"
              placeholder="أدخل النص العربي..."
            />
            <Button 
              onClick={() => handlePlay(arabicText)}
              disabled={isPlaying}
            >
              اختبار العربية
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={handleStop}
            disabled={!isPlaying}
          >
            Stop Audio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeechifyTest;
