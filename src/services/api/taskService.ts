
import { Task, TaskFormData } from '@/types/task.types';
import { BaseService } from './baseService';
import { ApiResponse } from './types';

export class TaskService extends BaseService {
  private static instance: TaskService;
  // Define this as a string literal type that matches a known table name
  private readonly path = 'tasks';

  private constructor() {
    super();
  }

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  async getTasks(): Promise<ApiResponse<Task[]>> {
    return this.get<Task[]>(this.path);
  }

  async getTask(id: string): Promise<ApiResponse<Task>> {
    return this.get<Task>(this.path, { id });
  }

  async createTask(taskData: TaskFormData): Promise<ApiResponse<Task>> {
    return this.post<Task>(this.path, taskData);
  }

  async updateTask(id: string, taskData: Partial<Task>): Promise<ApiResponse<Task>> {
    return this.update<Task>(this.path, id, taskData);
  }

  async deleteTask(id: string): Promise<ApiResponse<null>> {
    return this.delete(this.path, id);
  }
}

export const taskService = TaskService.getInstance();
