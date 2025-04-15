
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
          this.messagesMap[mode] = JSON.parse(storedMessages);
          console.log(`[GlobalChatMemory] Loaded ${this.messagesMap[mode].length} messages for mode: ${mode}`);
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
      localStorage.setItem(storageKey, JSON.stringify(this.messagesMap[mode] || []));
    } catch (e) {
      console.error(`[GlobalChatMemory] Error saving ${mode} messages to storage:`, e);
    }
  }
  
  getMessages(mode: string): AIMessage[] {
    return [...(this.messagesMap[mode] || [])];
  }
  
  setMessages(mode: string, messages: AIMessage[]) {
    this.messagesMap[mode] = [...messages];
    this.saveToStorage(mode);
    this.notifyListeners(mode);
  }
  
  addMessages(mode: string, newMessages: AIMessage[]) {
    if (!this.messagesMap[mode]) {
      this.messagesMap[mode] = [];
    }
    this.messagesMap[mode] = [...this.messagesMap[mode], ...newMessages];
    this.saveToStorage(mode);
    this.notifyListeners(mode);
  }
  
  clearMessages(mode: string) {
    this.messagesMap[mode] = [];
    const storageKey = `${BASE_STORAGE_KEY}-${mode}`;
    localStorage.removeItem(storageKey);
    this.notifyListeners(mode);
  }
  
  clearAllMessages() {
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
    
    this.listenersMap[mode].push(callback);
    // Immediately call with current state
    callback(this.getMessages(mode));
    
    // Return unsubscribe function
    return () => {
      if (this.listenersMap[mode]) {
        this.listenersMap[mode] = this.listenersMap[mode].filter(listener => listener !== callback);
      }
    };
  }
  
  private notifyListeners(mode: string) {
    if (this.listenersMap[mode]) {
      this.listenersMap[mode].forEach(listener => {
        listener(this.getMessages(mode));
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
      setMessages(updatedMessages);
    });
    
    // Cleanup subscription
    return unsubscribe;
  }, [mode]);
  
  return {
    messages,
    setMessages: (newMessages: AIMessage[]) => globalMemory.setMessages(mode, newMessages),
    addMessages: (newMessages: AIMessage[]) => globalMemory.addMessages(mode, newMessages),
    clearMessages: () => globalMemory.clearMessages(mode),
    clearAllMessages: () => globalMemory.clearAllMessages(),
    getMessages: () => globalMemory.getMessages(mode)
  };
};
