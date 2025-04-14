
import { TaskPriority } from '@/types/task.types';
import { AIMessage } from '@/types/ai-assistant.types';

export interface AITaskDetectionResult {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string | null;
  category?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  category?: string;
  userId: string;
  completedAt: string | null;
}

export interface UseChatOptions {
  sessionId?: string;
  initialMessages?: AIMessage[];
  enableTaskCreation?: boolean;
}

export interface SendMessageResult {
  success: boolean;
  error?: any;
}
