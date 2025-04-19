
import React from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { MeetingSummaryTool } from '@/components/ai/tools/MeetingSummaryTool';

const MeetingSummary = () => {
  return (
    <div className="min-h-screen bg-black/20 dark:bg-black/40">
      <motion.div 
        className="mx-auto p-4 sm:p-6 lg:p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col gap-2 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Meeting Summary
            </h1>
          </div>
          <p className="text-muted-foreground">
            Record meetings and generate AI-powered summaries with transcription, key points, and action items.
          </p>
        </div>

        <div className="max-w-4xl mx-auto w-full">
          <MeetingSummaryTool />
        </div>
      </motion.div>
    </div>
  );
};

export default MeetingSummary;
