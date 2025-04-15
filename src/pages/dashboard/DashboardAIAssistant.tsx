
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, Sparkles, BookOpen, Zap } from 'lucide-react';
import { UnifiedChatInterfaceWithProvider } from '@/components/ai/chat/UnifiedChatInterface';
import { motion } from 'framer-motion';

const DashboardAIAssistant = () => {
  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.2))',
      minHeight: '100vh'
    }}>
      <motion.div 
        className="mx-auto p-4 sm:p-6 md:p-8 space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-2 max-w-6xl mx-auto px-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">WAKTI AI Assistant</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Your intelligent assistant for managing tasks, scheduling, and more
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] transform hover:translate-y-[-5px] transition-all duration-300"
            style={{
              backdropFilter: 'blur(16px)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              boxShadow: '0 20px 50px 0 rgba(8, 112, 184, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
              transform: 'perspective(1000px) rotateX(1deg)'
            }}
          >
            <UnifiedChatInterfaceWithProvider />
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-2 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -10, scale: 1.02 }}
          >
            <Card className="h-full bg-white/20 backdrop-blur-xl border-white/30 hover:shadow-2xl transition-shadow duration-300 transform perspective-800"
              style={{
                boxShadow: '0 15px 35px rgba(8, 112, 184, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
                transformStyle: 'preserve-3d'
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  About WAKTI AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
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
            whileHover={{ y: -10, scale: 1.02 }}
          >
            <Card className="h-full bg-white/20 backdrop-blur-xl border-white/30 hover:shadow-2xl transition-shadow duration-300 transform perspective-800"
              style={{
                boxShadow: '0 15px 35px rgba(8, 112, 184, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
                transformStyle: 'preserve-3d'
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">AI Assistant Modes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-500 h-5 w-5 mt-0.5 flex-shrink-0 shadow-md"></div>
                    <div>
                      <span className="font-medium">General Chat:</span> General help, questions, app walkthroughs
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-500 h-5 w-5 mt-0.5 flex-shrink-0 shadow-md"></div>
                    <div>
                      <span className="font-medium">Student:</span> Assist with homework and learning
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-purple-500 h-5 w-5 mt-0.5 flex-shrink-0 shadow-md"></div>
                    <div>
                      <span className="font-medium">Productivity:</span> Manage tasks, reminders, and performance
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-5 w-5 mt-0.5 flex-shrink-0 shadow-md"></div>
                    <div>
                      <span className="font-medium">Creative:</span> Brainstorming, content creation, and visual ideas
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
