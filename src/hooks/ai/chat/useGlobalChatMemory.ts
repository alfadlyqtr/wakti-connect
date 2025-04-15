
import { useState, useEffect } from 'react';
import { AIMessage } from '@/types/ai-assistant.types';

// Simple local storage based global chat memory
const STORAGE_KEY = 'wakti-ai-chat';

// Create a singleton for global chat memory
class GlobalChatMemory {
  private messages: AIMessage[] = [];
  private listeners: ((messages: AIMessage[]) => void)[] = [];
  
  constructor() {
    this.loadFromStorage();
  }
  
  private loadFromStorage() {
    try {
      const storedMessages = localStorage.getItem(STORAGE_KEY);
      if (storedMessages) {
        this.messages = JSON.parse(storedMessages);
        console.log(`[GlobalChatMemory] Loaded ${this.messages.length} messages from storage`);
      }
    } catch (e) {
      console.error('[GlobalChatMemory] Error loading from storage:', e);
      this.messages = [];
    }
  }
  
  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.messages));
    } catch (e) {
      console.error('[GlobalChatMemory] Error saving to storage:', e);
    }
  }
  
  getMessages(): AIMessage[] {
    return [...this.messages];
  }
  
  setMessages(messages: AIMessage[]) {
    this.messages = [...messages];
    this.saveToStorage();
    this.notifyListeners();
  }
  
  addMessages(newMessages: AIMessage[]) {
    this.messages = [...this.messages, ...newMessages];
    this.saveToStorage();
    this.notifyListeners();
  }
  
  clearMessages() {
    this.messages = [];
    localStorage.removeItem(STORAGE_KEY);
    this.notifyListeners();
  }
  
  subscribe(callback: (messages: AIMessage[]) => void) {
    this.listeners.push(callback);
    // Immediately call with current state
    callback(this.getMessages());
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  private notifyListeners() {
    this.listeners.forEach(listener => {
      listener(this.getMessages());
    });
  }
}

// Create the singleton instance
const globalMemory = new GlobalChatMemory();

// Hook to access the global chat memory
export const useGlobalChatMemory = () => {
  const [messages, setMessages] = useState<AIMessage[]>(globalMemory.getMessages());
  
  useEffect(() => {
    // Subscribe to memory changes
    const unsubscribe = globalMemory.subscribe(updatedMessages => {
      setMessages(updatedMessages);
    });
    
    // Cleanup subscription
    return unsubscribe;
  }, []);
  
  return {
    messages,
    setMessages: (newMessages: AIMessage[]) => globalMemory.setMessages(newMessages),
    addMessages: (newMessages: AIMessage[]) => globalMemory.addMessages(newMessages),
    clearMessages: () => globalMemory.clearMessages(),
    getMessages: () => globalMemory.getMessages()
  };
};
