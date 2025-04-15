
import { ChatMemoryMessage } from '@/components/ai/personality-switcher/types';
import { v4 as uuidv4 } from 'uuid';

// Key for storing chat memory in localStorage
const STORAGE_KEY = 'wakti-ai-chat';
// Fixed session ID to maintain persistence
const FIXED_SESSION_ID = 'global-chat-session';

class GlobalChatMemory {
  private messages: ChatMemoryMessage[] = [];
  private listeners: ((messages: ChatMemoryMessage[]) => void)[] = [];
  
  constructor() {
    this.loadFromStorage();
  }
  
  private loadFromStorage() {
    try {
      const storedMessages = localStorage.getItem(STORAGE_KEY);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          // Convert string timestamps back to Date objects
          this.messages = parsedMessages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          console.log(`[GlobalChatMemory] Loaded ${this.messages.length} messages`);
        }
      }
    } catch (e) {
      console.error('[GlobalChatMemory] Error loading from storage:', e);
      this.messages = [];
    }
  }
  
  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.messages));
      console.log(`[GlobalChatMemory] Saved ${this.messages.length} messages`);
    } catch (e) {
      console.error('[GlobalChatMemory] Error saving to storage:', e);
    }
  }
  
  getMessages(): ChatMemoryMessage[] {
    return [...this.messages];
  }
  
  addMessage(message: Omit<ChatMemoryMessage, 'id' | 'timestamp'>) {
    const newMessage: ChatMemoryMessage = {
      ...message,
      id: uuidv4(),
      timestamp: new Date()
    };
    
    this.messages.push(newMessage);
    this.saveToStorage();
    this.notifyListeners();
    return newMessage;
  }
  
  clearMessages() {
    this.messages = [];
    localStorage.removeItem(STORAGE_KEY);
    this.notifyListeners();
  }
  
  getSessionId() {
    return FIXED_SESSION_ID;
  }
  
  subscribe(callback: (messages: ChatMemoryMessage[]) => void) {
    this.listeners.push(callback);
    // Immediately call with current state
    callback(this.getMessages());
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  private notifyListeners() {
    const messages = this.getMessages();
    this.listeners.forEach(listener => {
      listener(messages);
    });
  }
}

// Create a singleton instance
export const globalChatMemory = new GlobalChatMemory();
