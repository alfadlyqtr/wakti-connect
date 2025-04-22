
import React from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { MeetingSummaryTool } from '@/components/ai/tools/MeetingSummaryTool';
import { FeatureLockButton } from '@/components/feature-lock/FeatureLockButton';

const MeetingSummary = () => {
  return (
    <div className="min-h-screen bg-white">
      <motion.div 
        className="mx-auto p-4 sm:p-6 lg:p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col gap-2 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-wakti-navy text-white flex items-center justify-center">
                <Mic className="h-5 w-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-wakti-navy">
                Voice Recorder & Transcription
              </h1>
            </div>
            <FeatureLockButton featureName="meeting_recording" />
          </div>
          <p className="text-wakti-navy/70">
            Record meetings, lectures, and more to get AI-powered transcripts with key points and summaries.
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
