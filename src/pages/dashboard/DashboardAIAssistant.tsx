import React from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useAIAssistant } from "@/hooks/ai/useAIAssistant";
import { useAISettings } from "@/hooks/ai/useAISettings";
import { AIAssistantUpgradeCard } from "@/components/ai/AIAssistantUpgradeCard";
import { AIAssistantHistoryCard } from "@/components/ai/AIAssistantHistoryCard";
import { AIAssistantChatCard } from "@/components/ai/assistant/AIAssistantChatCard";
import { AISettingsProvider } from "@/components/settings/ai/context/AISettingsContext";
import { Card } from "@/components/ui/card";

const DashboardAIAssistant = () => {
  const { aiSettings, isLoadingSettings, canUseAI } = useAISettings();
  const { 
    messages,
    sendMessage, 
    isLoading, 
    inputMessage, 
    setInputMessage, 
    clearMessages 
  } = useAIAssistant();

  return (
    <DashboardShell>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">WAKTI AI Assistant</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Chat Area */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          {!canUseAI && (
            <AIAssistantUpgradeCard />
          )}

          {canUseAI && (
            <AIAssistantChatCard
              messages={messages}
              isLoading={isLoading}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              onSendMessage={sendMessage}
              onClearChat={clearMessages}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="col-span-1 space-y-4">
          {canUseAI && (
            <AISettingsProvider defaultSettings={aiSettings} isLoading={isLoadingSettings}>
              <Card className="p-4">
                <h3 className="font-medium mb-2">AI Assistant Settings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure how the AI assistant interacts with you.
                </p>
                {/* Settings content */}
              </Card>
            </AISettingsProvider>
          )}

          <AIAssistantHistoryCard />
        </div>
      </div>
    </DashboardShell>
  );
};

export default DashboardAIAssistant;
