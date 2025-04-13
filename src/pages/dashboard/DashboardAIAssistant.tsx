
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { AIAssistantChat } from '@/components/ai/assistant/AIAssistantChat';
import { MessageInputForm } from '@/components/ai/assistant/MessageInputForm';
import { EmptyStateView } from '@/components/ai/assistant/EmptyStateView';
import { PoweredByTMW } from '@/components/ai/assistant/PoweredByTMW';
import { AIRoleSelector } from '@/components/ai/assistant/AIRoleSelector';
import { AIAssistantDocumentsCard } from '@/components/ai/AIAssistantDocumentsCard';
import { AIAssistantUpgradeCard } from '@/components/ai/AIAssistantUpgradeCard';
import { AIAssistantChatCard } from '@/components/ai/assistant/AIAssistantChatCard';
import { AIMessage, AIAssistantRole } from '@/types/ai-assistant.types';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TaskConfirmationCard } from '@/components/ai/task/TaskConfirmationCard';
import { Bot, Trash2, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { getTimeBasedGreeting } from '@/lib/dateUtils';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ParsedTaskInfo } from '@/hooks/ai/utils/taskParser.types';
import { NestedSubtask } from '@/services/ai/aiTaskParserService';

const DashboardAIAssistant = () => {
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    clearMessages, 
    detectedTask,
    confirmCreateTask,
    cancelCreateTask,
    isCreatingTask,
    pendingTaskConfirmation,
    canUseAI,
    storeCurrentRole
  } = useAIAssistant();
  
  const { user } = useAuth();
  const [inputMessage, setInputMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState<AIAssistantRole>('general');
  const [storedRole, setStoredRole] = useLocalStorage<AIAssistantRole>('ai_assistant_role', 'general');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  
  // Set sidebar closed by default on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);
  
  // Load stored role on component mount
  useEffect(() => {
    if (storedRole) {
      setSelectedRole(storedRole);
    }
  }, [storedRole]);
  
  // Store selected role when it changes
  useEffect(() => {
    setStoredRole(selectedRole);
    storeCurrentRole(selectedRole);
  }, [selectedRole, setStoredRole, storeCurrentRole]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    
    try {
      await sendMessage(inputMessage);
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const handleRoleChange = (role: AIAssistantRole) => {
    setSelectedRole(role);
    // Clear messages when changing roles
    clearMessages();
  };
  
  const handleUseDocumentContent = (content: string) => {
    setInputMessage(prev => {
      if (prev.trim()) {
        return `${prev}\n\n${content}`;
      }
      return content;
    });
  };
  
  // Get user's first name for greeting
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || '';
  
  // Helper function to safely cast the task with default values for required fields
  const getTaskInfo = (): ParsedTaskInfo => {
    if (!detectedTask) {
      return {
        title: "Untitled Task",
        priority: "normal",
        subtasks: []
      };
    }
    
    // Ensure subtasks are properly formatted as (string | NestedSubtask)[]
    const formattedSubtasks: (string | NestedSubtask)[] = [];
    
    if (detectedTask.subtasks && Array.isArray(detectedTask.subtasks)) {
      detectedTask.subtasks.forEach(subtask => {
        if (typeof subtask === 'string') {
          formattedSubtasks.push(subtask);
        } else if (subtask && typeof subtask === 'object') {
          // Handle conversion from SubTask to NestedSubtask
          if (subtask.is_group && (subtask.title || subtask.content)) {
            const nestedSubtask: NestedSubtask = {
              title: subtask.title || subtask.content || "Untitled Group",
              subtasks: []
            };
            
            // Add children if they exist
            if (subtask.subtasks && Array.isArray(subtask.subtasks)) {
              subtask.subtasks.forEach(child => {
                if (typeof child === 'string') {
                  nestedSubtask.subtasks.push(child);
                } else if (child && typeof child === 'object') {
                  // Convert child SubTask to either string or nested object
                  if (child.is_group) {
                    // Child is also a group
                    const childGroup: NestedSubtask = {
                      title: child.title || child.content || "Untitled Subgroup",
                      subtasks: []
                    };
                    nestedSubtask.subtasks.push(childGroup);
                  } else {
                    // Child is a regular subtask
                    nestedSubtask.subtasks.push(child.content || "Untitled Task");
                  }
                }
              });
            }
            
            formattedSubtasks.push(nestedSubtask);
          } else {
            // It's a regular SubTask, not a group
            formattedSubtasks.push(subtask.content || "Untitled Task");
          }
        }
      });
    } else if (detectedTask.originalSubtasks && Array.isArray(detectedTask.originalSubtasks)) {
      // If we have originalSubtasks (preserved nested structure), use those instead
      detectedTask.originalSubtasks.forEach(item => {
        if (typeof item === 'string') {
          formattedSubtasks.push(item);
        } else if (item && typeof item === 'object' && 'title' in item) {
          // Ensure it has required properties for NestedSubtask
          const nestedItem: NestedSubtask = {
            title: item.title || "Untitled Group",
            subtasks: Array.isArray(item.subtasks) ? item.subtasks : []
          };
          formattedSubtasks.push(nestedItem);
        }
      });
    }
    
    // Ensure required properties exist with fallbacks
    return {
      title: detectedTask.title || "Untitled Task",
      priority: detectedTask.priority || "normal",
      subtasks: formattedSubtasks,
      description: detectedTask.description,
      due_date: detectedTask.due_date,
      dueTime: detectedTask.due_time,
      location: detectedTask.location
    };
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Task confirmation overlay */}
      {pendingTaskConfirmation && detectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <TaskConfirmationCard
              taskInfo={getTaskInfo()}
              onConfirm={() => confirmCreateTask(detectedTask)}
              onCancel={cancelCreateTask}
              isLoading={isCreatingTask}
            />
          </div>
        </div>
      )}
      
      <div className="flex-1 flex flex-col md:flex-row gap-4 h-full">
        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-h-0">
          <AIAssistantChatCard
            messages={messages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            canAccess={canUseAI}
            clearMessages={clearMessages}
            selectedRole={selectedRole}
            onRoleChange={handleRoleChange}
            userName={userName}
          />
        </div>
        
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="w-full md:w-80 space-y-4 flex flex-col">
            <Card className="shadow-md border-wakti-blue/10 overflow-hidden rounded-xl">
              <CardHeader className="py-3 px-4 border-b bg-gradient-to-r from-white to-gray-50">
                <CardTitle className="text-base flex items-center">
                  <Bot className="h-4 w-4 mr-1.5" />
                  Assistant Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Choose Assistant Type</h3>
                    <AIRoleSelector
                      selectedRole={selectedRole}
                      onRoleChange={handleRoleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <AIAssistantDocumentsCard
              canAccess={canUseAI}
              onUseDocumentContent={handleUseDocumentContent}
              selectedRole={selectedRole}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAIAssistant;
