import { useState, useEffect } from 'react';
import { AIMessage } from '@/types/ai-assistant.types';
import { MessageTransaction } from './types';

const BASE_STORAGE_KEY = 'wakti-ai-chat';

class GlobalChatMemory {
  private messagesMap: Record<string, AIMessage[]> = {};
  private listenersMap: Record<string, ((messages: AIMessage[]) => void)[]> = {};
  private transactions: Record<string, MessageTransaction[]> = {};
  
  constructor() {
    this.loadFromStorage();
  }
  
  private loadFromStorage() {
    try {
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
        
        this.transactions[mode] = [];
      });
    } catch (e) {
      console.error('[GlobalChatMemory] Error loading from storage:', e);
      this.messagesMap = {
        general: [],
        productivity: [],
        student: [],
        creative: []
      };
      
      Object.keys(this.messagesMap).forEach(mode => {
        this.transactions[mode] = [];
      });
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
    return [...(this.messagesMap[mode] || [])];
  }
  
  setMessages(mode: string, messages: AIMessage[]) {
    console.log(`[GlobalChatMemory] Setting ${messages.length} messages for mode: ${mode}`);
    this.messagesMap[mode] = [...messages];
    this.saveToStorage(mode);
    this.notifyListeners(mode);
    
    this.addTransaction(mode, {
      type: 'update',
      messages: [...messages]
    });
  }
  
  addMessages(mode: string, newMessages: AIMessage[]) {
    if (!this.messagesMap[mode]) {
      this.messagesMap[mode] = [];
    }
    
    if (newMessages.length === 0) return;
    
    console.log(`[GlobalChatMemory] Adding ${newMessages.length} messages to ${this.messagesMap[mode].length} existing messages for mode: ${mode}`);
    
    const existingIds = new Set(this.messagesMap[mode].map(msg => msg.id));
    const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg.id));
    
    if (uniqueNewMessages.length === 0) {
      console.log(`[GlobalChatMemory] No unique messages to add for mode: ${mode}`);
      return;
    }
    
    this.messagesMap[mode] = [...this.messagesMap[mode], ...uniqueNewMessages];
    this.saveToStorage(mode);
    this.notifyListeners(mode);
    
    this.addTransaction(mode, {
      type: 'add',
      messages: uniqueNewMessages
    });
  }
  
  addMessage(mode: string, newMessage: AIMessage) {
    this.addMessages(mode, [newMessage]);
  }
  
  clearMessages(mode: string) {
    console.log(`[GlobalChatMemory] Clearing messages for mode: ${mode}`);
    this.messagesMap[mode] = [];
    const storageKey = `${BASE_STORAGE_KEY}-${mode}`;
    localStorage.removeItem(storageKey);
    this.notifyListeners(mode);
    
    this.addTransaction(mode, {
      type: 'clear'
    });
  }
  
  clearAllMessages() {
    console.log(`[GlobalChatMemory] Clearing all messages for all modes`);
    const modes = Object.keys(this.messagesMap);
    modes.forEach(mode => {
      this.messagesMap[mode] = [];
      const storageKey = `${BASE_STORAGE_KEY}-${mode}`;
      localStorage.removeItem(storageKey);
      this.notifyListeners(mode);
      
      this.addTransaction(mode, {
        type: 'clear'
      });
    });
  }
  
  private addTransaction(mode: string, transaction: MessageTransaction) {
    if (!this.transactions[mode]) {
      this.transactions[mode] = [];
    }
    
    this.transactions[mode].push(transaction);
    
    if (this.transactions[mode].length > 50) {
      this.transactions[mode] = this.transactions[mode].slice(-50);
    }
  }
  
  getTransactions(mode: string): MessageTransaction[] {
    return [...(this.transactions[mode] || [])];
  }
  
  subscribe(mode: string, callback: (messages: AIMessage[]) => void) {
    if (!this.listenersMap[mode]) {
      this.listenersMap[mode] = [];
    }
    
    console.log(`[GlobalChatMemory] Adding listener for mode: ${mode}`);
    this.listenersMap[mode].push(callback);
    
    callback(this.getMessages(mode));
    
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

const globalMemory = new GlobalChatMemory();

export const useGlobalChatMemory = (mode: string = 'general') => {
  const [messages, setMessages] = useState<AIMessage[]>(globalMemory.getMessages(mode));
  
  useEffect(() => {
    const unsubscribe = globalMemory.subscribe(mode, updatedMessages => {
      console.log(`[useGlobalChatMemory] Received ${updatedMessages.length} updated messages for mode: ${mode}`);
      setMessages(updatedMessages);
    });
    
    return unsubscribe;
  }, [mode]);
  
  const addMessage = (newMessage: AIMessage) => {
    globalMemory.addMessage(mode, newMessage);
  };
  
  const addMessages = (newMessages: AIMessage[]) => {
    globalMemory.addMessages(mode, newMessages);
  };
  
  const setMessagesWrapper = (newMessages: AIMessage[]) => {
    console.log(`[useGlobalChatMemory] Setting ${newMessages.length} messages for mode: ${mode}`);
    globalMemory.setMessages(mode, newMessages);
  };
  
  const clearMessagesWrapper = () => {
    globalMemory.clearMessages(mode);
  };
  
  return {
    messages,
    setMessages: setMessagesWrapper,
    addMessage,
    addMessages,
    clearMessages: clearMessagesWrapper,
    clearAllMessages: () => globalMemory.clearAllMessages(),
    getMessages: () => globalMemory.getMessages(mode),
    getTransactions: () => globalMemory.getTransactions(mode)
  };
};
