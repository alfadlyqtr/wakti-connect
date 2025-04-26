
import { taskRepository } from "../repositories/taskRepository";
import { Task, TaskFormData } from "../types";

export class TaskService {
  /**
   * Fetch user tasks with optional filtering
   */
  async getUserTasks(userId?: string): Promise<Task[]> {
    return await taskRepository.fetchUserTasks(userId);
  }
  
  /**
   * Create a new task
   */
  async createTask(taskData: TaskFormData): Promise<Task | null> {
    return await taskRepository.createTask(taskData);
  }
  
  /**
   * Update an existing task
   */
  async updateTask(taskId: string, taskData: Partial<TaskFormData>): Promise<Task | null> {
    return await taskRepository.updateTask(taskId, taskData);
  }
  
  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<boolean> {
    return await taskRepository.deleteTask(taskId);
  }
  
  /**
   * Complete a task
   */
  async completeTask(taskId: string): Promise<Task | null> {
    return await taskRepository.completeTask(taskId);
  }
  
  /**
   * Search tasks by query
   */
  async searchTasks(query: string): Promise<Task[]> {
    return await taskRepository.searchTasks(query);
  }
}

export const taskService = new TaskService();
