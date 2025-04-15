
import React from "react";
import { motion } from "framer-motion";
import { AISettings } from "@/types/ai-assistant.types";
import { UseMutationResult } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIAssistantSettings as SettingsComponent } from "@/components/settings/ai";

interface AIAssistantSettingsProps {
  aiSettings: AISettings | null;
  isLoading: boolean;
  updateSettings: UseMutationResult<AISettings, Error, AISettings>;
}

export const AIAssistantSettings: React.FC<AIAssistantSettingsProps> = ({
  aiSettings,
  isLoading,
  updateSettings,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">AI Assistant Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsComponent />
        </CardContent>
      </Card>
    </motion.div>
  );
};
