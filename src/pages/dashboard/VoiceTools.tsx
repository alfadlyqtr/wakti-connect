
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MeetingSummaryTool } from '@/components/ai/tools/MeetingSummaryTool';
import { VoiceToTextTool } from '@/components/ai/tools/VoiceToTextTool';
import { LectureNotesTool } from '@/components/ai/tools/lecture-notes/LectureNotesTool';
import { Mic, FileText, Book } from 'lucide-react';
import { motion } from 'framer-motion';

const VoiceTools = () => {
  const [activeTab, setActiveTab] = useState('meeting-summary');

  return (
    <div 
      className="min-h-screen bg-black/20 dark:bg-black/40" 
      style={{ 
        background: 'transparent',
        minHeight: 'calc(100vh - 60px)'
      }}
    >
      <motion.div 
        className="mx-auto p-2 sm:p-6 md:p-8 space-y-6 sm:space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-2 max-w-6xl mx-auto px-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Voice Transcription Tools
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Compare and use different voice processing tools
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle>Voice Tools Comparison</CardTitle>
              <CardDescription>
                Compare the functionality of different voice transcription tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="meeting-summary" className="flex items-center gap-2 w-full">
                    <FileText className="h-4 w-4" />
                    <span>Meeting Summary</span>
                  </TabsTrigger>
                  <TabsTrigger value="lecture-notes" className="flex items-center gap-2 w-full">
                    <Book className="h-4 w-4" />
                    <span>Lecture Notes</span>
                  </TabsTrigger>
                  <TabsTrigger value="voice-to-text" className="flex items-center gap-2 w-full">
                    <Mic className="h-4 w-4" />
                    <span>Voice to Text</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="meeting-summary" className="mt-0">
                  <MeetingSummaryTool />
                </TabsContent>
                
                <TabsContent value="lecture-notes" className="mt-0">
                  <LectureNotesTool />
                </TabsContent>
                
                <TabsContent value="voice-to-text" className="mt-0">
                  <VoiceToTextTool />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceTools;
