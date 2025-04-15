
import { useState, useEffect } from 'react';
import { AIMessage } from '@/types/ai-assistant.types';

// Update storage key to support multiple modes
const BASE_STORAGE_KEY = 'wakti-ai-chat';

// Create a singleton for global chat memory with mode support
class GlobalChatMemory {
  private messagesMap: Record<string, AIMessage[]> = {};
  private listenersMap: Record<string, ((messages: AIMessage[]) => void)[]> = {};
  
  constructor() {
    this.loadFromStorage();
  }
  
  private loadFromStorage() {
    try {
      // Load messages for all modes from localStorage
      const modes = ['general', 'productivity', 'student', 'creative'];
      
      modes.forEach(mode => {
        const storageKey = `${BASE_STORAGE_KEY}-${mode}`;
        const storedMessages = localStorage.getItem(storageKey);
        
        if (storedMessages) {
          try {
            const parsedMessages = JSON.parse(storedMessages);
            if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
              this.messagesMap[mode] = parsedMessages;
              console.log(`[GlobalChatMemory] Loaded ${this.messagesMap[mode].length} messages for mode: ${mode}`);
            } else {
              this.messagesMap[mode] = [];
            }
          } catch (e) {
            console.error(`[GlobalChatMemory] Error parsing messages for mode ${mode}:`, e);
            this.messagesMap[mode] = [];
          }
        } else {
          this.messagesMap[mode] = [];
        }
      });
    } catch (e) {
      console.error('[GlobalChatMemory] Error loading from storage:', e);
      this.messagesMap = {
        general: [],
        productivity: [],
        student: [],
        creative: []
      };
    }
  }
  
  private saveToStorage(mode: string) {
    try {
      const storageKey = `${BASE_STORAGE_KEY}-${mode}`;
      const messages = this.messagesMap[mode] || [];
      console.log(`[GlobalChatMemory] Saving ${messages.length} messages for mode: ${mode}`);
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (e) {
      console.error(`[GlobalChatMemory] Error saving ${mode} messages to storage:`, e);
    }
  }
  
  getMessages(mode: string): AIMessage[] {
    // Return a copy of the messages to prevent direct mutation
    return [...(this.messagesMap[mode] || [])];
  }
  
  setMessages(mode: string, messages: AIMessage[]) {
    console.log(`[GlobalChatMemory] Setting ${messages.length} messages for mode: ${mode}`);
    this.messagesMap[mode] = [...messages];
    this.saveToStorage(mode);
    this.notifyListeners(mode);
  }
  
  addMessages(mode: string, newMessages: AIMessage[]) {
    if (!this.messagesMap[mode]) {
      this.messagesMap[mode] = [];
    }
    
    console.log(`[GlobalChatMemory] Adding ${newMessages.length} messages to ${this.messagesMap[mode].length} existing messages for mode: ${mode}`);
    this.messagesMap[mode] = [...this.messagesMap[mode], ...newMessages];
    this.saveToStorage(mode);
    this.notifyListeners(mode);
  }
  
  clearMessages(mode: string) {
    console.log(`[GlobalChatMemory] Clearing messages for mode: ${mode}`);
    this.messagesMap[mode] = [];
    const storageKey = `${BASE_STORAGE_KEY}-${mode}`;
    localStorage.removeItem(storageKey);
    this.notifyListeners(mode);
  }
  
  clearAllMessages() {
    console.log(`[GlobalChatMemory] Clearing all messages for all modes`);
    const modes = Object.keys(this.messagesMap);
    modes.forEach(mode => {
      this.messagesMap[mode] = [];
      const storageKey = `${BASE_STORAGE_KEY}-${mode}`;
      localStorage.removeItem(storageKey);
      this.notifyListeners(mode);
    });
  }
  
  subscribe(mode: string, callback: (messages: AIMessage[]) => void) {
    if (!this.listenersMap[mode]) {
      this.listenersMap[mode] = [];
    }
    
    console.log(`[GlobalChatMemory] Adding listener for mode: ${mode}`);
    this.listenersMap[mode].push(callback);
    
    // Immediately call with current state
    callback(this.getMessages(mode));
    
    // Return unsubscribe function
    return () => {
      if (this.listenersMap[mode]) {
        this.listenersMap[mode] = this.listenersMap[mode].filter(listener => listener !== callback);
        console.log(`[GlobalChatMemory] Removed listener for mode: ${mode}`);
      }
    };
  }
  
  private notifyListeners(mode: string) {
    if (this.listenersMap[mode] && this.listenersMap[mode].length > 0) {
      console.log(`[GlobalChatMemory] Notifying ${this.listenersMap[mode].length} listeners for mode: ${mode}`);
      const messages = this.getMessages(mode);
      this.listenersMap[mode].forEach(listener => {
        listener(messages);
      });
    }
  }
}

// Create the singleton instance
const globalMemory = new GlobalChatMemory();

// Hook to access the global chat memory with mode support
export const useGlobalChatMemory = (mode: string = 'general') => {
  const [messages, setMessages] = useState<AIMessage[]>(globalMemory.getMessages(mode));
  
  useEffect(() => {
    // Subscribe to memory changes for this specific mode
    const unsubscribe = globalMemory.subscribe(mode, updatedMessages => {
      console.log(`[useGlobalChatMemory] Received ${updatedMessages.length} updated messages for mode: ${mode}`);
      setMessages(updatedMessages);
    });
    
    // Cleanup subscription
    return unsubscribe;
  }, [mode]);
  
  const setMessagesWrapper = (newMessages: AIMessage[]) => {
    console.log(`[useGlobalChatMemory] Setting ${newMessages.length} messages for mode: ${mode}`);
    globalMemory.setMessages(mode, newMessages);
  };
  
  return {
    messages,
    setMessages: setMessagesWrapper,
    addMessages: (newMessages: AIMessage[]) => globalMemory.addMessages(mode, newMessages),
    clearMessages: () => globalMemory.clearMessages(mode),
    clearAllMessages: () => globalMemory.clearAllMessages(),
    getMessages: () => globalMemory.getMessages(mode)
  };
};
