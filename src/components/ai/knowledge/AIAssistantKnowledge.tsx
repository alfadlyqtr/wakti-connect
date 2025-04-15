
import React from "react";
import { motion } from "framer-motion";
import { AIKnowledgeUpload } from "@/types/ai-assistant.types";
import { UseMutationResult } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIKnowledgeTab } from "@/components/settings/ai/AIKnowledgeTab";

interface AIAssistantKnowledgeProps {
  addKnowledge: UseMutationResult<any, unknown, any>;
  knowledgeUploads: AIKnowledgeUpload[] | undefined;
  isLoading: boolean;
  deleteKnowledge: UseMutationResult<any, unknown, any>;
}

export const AIAssistantKnowledge: React.FC<AIAssistantKnowledgeProps> = ({
  addKnowledge,
  knowledgeUploads,
  isLoading,
  deleteKnowledge,
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
          <CardTitle className="text-xl">Knowledge Management</CardTitle>
        </CardHeader>
        <CardContent>
          <AIKnowledgeTab />
        </CardContent>
      </Card>
    </motion.div>
  );
};
