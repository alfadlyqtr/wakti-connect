
import { AIMessage, WAKTIAIMode } from "@/types/ai-assistant.types";
import { v4 as uuidv4 } from 'uuid';

export type ChatMemoryMessage = AIMessage;

type GlobalChatMemoryListener = (messages: ChatMemoryMessage[]) => void;

class GlobalChatMemory {
  private messages: Record<WAKTIAIMode, ChatMemoryMessage[]> = {
    general: [],
    student: [],
    productivity: [],
    creative: []
  };
  
  private listeners: GlobalChatMemoryListener[] = [];
  private sessionId: string;
  
  constructor() {
    this.sessionId = uuidv4();
    
    // Try to load saved messages from localStorage
    this.loadFromStorage();
    
    // Save messages to storage on page unload
    window.addEventListener('beforeunload', () => {
      this.saveToStorage();
    });
  }
  
  private loadFromStorage() {
    try {
      const savedMessages = localStorage.getItem('chat_memory');
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        
        // Ensure all required modes exist
        this.messages = {
          general: [],
          student: [],
          productivity: [],
          creative: [],
          ...parsed
        };
        
        // Convert string dates to Date objects
        Object.keys(this.messages).forEach((mode) => {
          this.messages[mode as WAKTIAIMode] = this.messages[mode as WAKTIAIMode].map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        });
      }
    } catch (error) {
      console.error('Error loading chat memory from storage:', error);
    }
  }
  
  private saveToStorage() {
    try {
      localStorage.setItem('chat_memory', JSON.stringify(this.messages));
    } catch (error) {
      console.error('Error saving chat memory to storage:', error);
    }
  }
  
  public getMessages(mode: WAKTIAIMode = 'general'): ChatMemoryMessage[] {
    return this.messages[mode] || [];
  }
  
  public addMessage(message: Omit<ChatMemoryMessage, 'id'>) {
    const mode = message.mode || 'general';
    
    // Create a new message with ID
    const newMessage: ChatMemoryMessage = {
      ...message,
      id: uuidv4()
    };
    
    // Add to the appropriate mode's message list
    this.messages[mode] = [...(this.messages[mode] || []), newMessage];
    
    // Notify listeners
    this.notifyListeners(mode);
    
    // Save to storage after each message
    this.saveToStorage();
    
    return newMessage;
  }
  
  public clearMessages(mode?: WAKTIAIMode) {
    if (mode) {
      // Clear just the specified mode
      this.messages[mode] = [];
      this.notifyListeners(mode);
    } else {
      // Clear all modes
      Object.keys(this.messages).forEach(m => {
        this.messages[m as WAKTIAIMode] = [];
      });
      
      // Notify for all modes
      Object.keys(this.messages).forEach(m => {
        this.notifyListeners(m as WAKTIAIMode);
      });
    }
    
    // Save cleared state to storage
    this.saveToStorage();
  }
  
  public subscribe(callback: GlobalChatMemoryListener): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }
  
  private notifyListeners(mode: WAKTIAIMode) {
    // Get the messages for the current mode
    const currentMessages = this.getMessages(mode);
    
    // Notify all listeners with these messages
    this.listeners.forEach(listener => {
      listener(currentMessages);
    });
  }
  
  public getSessionId(): string {
    return this.sessionId;
  }
}

// Create a singleton instance
export const globalChatMemory = new GlobalChatMemory();

export default globalChatMemory;
