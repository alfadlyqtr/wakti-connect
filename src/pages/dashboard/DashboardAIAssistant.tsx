
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, Sparkles, BookOpen, Zap } from 'lucide-react';
import { UnifiedChatInterfaceWithProvider } from '@/components/ai/chat/UnifiedChatInterface';
import { motion } from 'framer-motion';

const DashboardAIAssistant = () => {
  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(to right, #fdfcfb 0%, #e2d1c3 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <motion.div 
        className="mx-auto p-2 sm:p-4 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-2 max-w-5xl mx-auto px-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">WAKTI AI Assistant</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Your intelligent assistant for managing tasks, scheduling, and more
          </p>
        </div>
        
        <UnifiedChatInterfaceWithProvider />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto px-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full glassmorphism hover:shadow-md transition-shadow border-white/20 bg-transparent backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bot className="h-4 w-4" />
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
          >
            <Card className="h-full glassmorphism hover:shadow-md transition-shadow border-white/20 bg-transparent backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">AI Assistant Modes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-500 h-5 w-5 mt-0.5 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">General Chat:</span> General help, questions, app walkthroughs
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-500 h-5 w-5 mt-0.5 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Student:</span> Assist with homework and learning
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-yellow-500 h-5 w-5 mt-0.5 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Productivity:</span> Manage tasks, reminders, and performance
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-5 w-5 mt-0.5 flex-shrink-0"></div>
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
