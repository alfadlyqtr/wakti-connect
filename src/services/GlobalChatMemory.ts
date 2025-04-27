
import { v4 as uuidv4 } from 'uuid';
import { ChatMemoryMessage, WAKTIAIMode } from '@/components/ai/personality-switcher/types';

type SubscriptionCallback = (messages: ChatMemoryMessage[]) => void;

class GlobalChatMemory {
  private messages: Record<WAKTIAIMode, ChatMemoryMessage[]> = {
    'general': [],
    'student': [],
    'productivity': [],
    'creative': [],
    'employee': [],
    'writer': [],
    'business_owner': []
  };
  private subscribers: SubscriptionCallback[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = uuidv4();
  }

  getMessages(mode: WAKTIAIMode = 'general'): ChatMemoryMessage[] {
    return this.messages[mode] || [];
  }

  addMessage(message: ChatMemoryMessage) {
    // Get mode from message or default to general
    const mode = message.mode || 'general' as WAKTIAIMode;
    
    if (!this.messages[mode]) {
      this.messages[mode] = [];
    }
    
    // Ensure message has an ID and timestamp
    const messageWithId = {
      ...message,
      id: message.id || uuidv4(),
      timestamp: message.timestamp || new Date()
    };
    
    this.messages[mode].push(messageWithId);
    this.notifySubscribers(mode);
  }

  clearMessages(mode?: WAKTIAIMode) {
    if (mode) {
      this.messages[mode] = [];
      this.notifySubscribers(mode);
    } else {
      // Clear all modes
      Object.keys(this.messages).forEach(modeKey => {
        this.messages[modeKey as WAKTIAIMode] = [];
      });
      // Notify subscribers of all modes
      Object.keys(this.messages).forEach(modeKey => {
        this.notifySubscribers(modeKey as WAKTIAIMode);
      });
    }
  }

  subscribe(callback: SubscriptionCallback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notifySubscribers(mode: WAKTIAIMode) {
    this.subscribers.forEach(callback => {
      callback(this.messages[mode]);
    });
  }

  getSessionId() {
    return this.sessionId;
  }
}

// Create a singleton instance
export const globalChatMemory = new GlobalChatMemory();
