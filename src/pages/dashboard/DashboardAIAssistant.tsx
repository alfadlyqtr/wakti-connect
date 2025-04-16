
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, Sparkles, BookOpen, Zap } from 'lucide-react';
import { UnifiedChatInterfaceWithProvider } from '@/components/ai/chat/UnifiedChatInterface';
import { motion } from 'framer-motion';

const DashboardAIAssistant = () => {
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white dark:text-white/90 bg-black/50 px-3 py-2 rounded-lg shadow-lg">
            WAKTI AI Assistant
          </h1>
          <p className="text-blue-300/80 text-sm sm:text-base bg-black/40 px-3 py-1 rounded-lg">
            Your intelligent assistant for managing tasks, scheduling, and more
          </p>
        </div>
        
        <div className="max-w-6xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full rounded-xl sm:rounded-2xl overflow-hidden transform hover:translate-y-[-12px] transition-all duration-500"
            style={{
              backdropFilter: 'blur(20px)',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 30px rgba(59, 130, 246, 0.3)',
              transform: 'perspective(1500px) rotateX(1deg)',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden'
            }}
          >
            <UnifiedChatInterfaceWithProvider />
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-6xl mx-auto px-2 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -15, scale: 1.02 }}
          >
            <Card className="h-full bg-black/20 backdrop-blur-xl border-white/5 hover:shadow-2xl transition-shadow duration-300 transform perspective-1500"
              style={{
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset, 0 0 20px rgba(59, 130, 246, 0.2)',
                transformStyle: 'preserve-3d',
                transform: 'perspective(1500px) rotateX(1deg)',
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-white">
                  <Bot className="h-5 w-5 text-blue-400" />
                  About WAKTI AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-100/80 leading-relaxed">
                  WAKTI AI is an intelligent assistant designed to help you manage tasks, 
                  create reminders, assist with learning, generate creative content, and more.
                  Choose from different modes tailored to your specific needs.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -15, scale: 1.02 }}
          >
            <Card className="h-full bg-black/20 backdrop-blur-xl border-white/5 hover:shadow-2xl transition-shadow duration-300 transform perspective-1500"
              style={{
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset, 0 0 20px rgba(59, 130, 246, 0.2)',
                transformStyle: 'preserve-3d',
                transform: 'perspective(1500px) rotateX(1deg)',
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-white">AI Assistant Modes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-500 h-5 w-5 mt-0.5 flex-shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
                    <div className="text-blue-100/80">
                      <span className="font-medium text-white">General Chat:</span> General help, questions, app walkthroughs
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-green-500 h-5 w-5 mt-0.5 flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.6)]"></div>
                    <div className="text-blue-100/80">
                      <span className="font-medium text-white">Student:</span> Assist with homework and learning
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-purple-500 h-5 w-5 mt-0.5 flex-shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.6)]"></div>
                    <div className="text-blue-100/80">
                      <span className="font-medium text-white">Productivity:</span> Manage tasks, reminders, and performance
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-5 w-5 mt-0.5 flex-shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.6)]"></div>
                    <div className="text-blue-100/80">
                      <span className="font-medium text-white">Creative:</span> Brainstorming, content creation, and visual ideas
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardAIAssistant;
