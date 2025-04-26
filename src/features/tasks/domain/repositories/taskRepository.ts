
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, TaskPriority, TaskFormData } from "../types";
import { validateTaskStatus, validateTaskPriority } from "../utils/statusValidator";

export class TaskRepository {
  /**
   * Fetch tasks for the current user
   */
  async fetchUserTasks(userId?: string): Promise<Task[]> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return [];
      }
      
      const user_id = userId || session.user.id;
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*, subtasks:todo_items(*)')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });
          
      if (error) throw error;
      
      // Cast the status to TaskStatus type to satisfy TypeScript
      return (data || []).map(task => ({
        ...task,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        subtasks: task.subtasks || []
      })) as Task[];
    } catch (err) {
      console.error('Error fetching tasks:', err);
      return [];
    }
  }
  
  /**
   * Fetch a specific task by ID
   */
  async fetchTaskById(taskId: string): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, subtasks:todo_items(*)')
        .eq('id', taskId)
        .single();
          
      if (error) throw error;
      
      return {
        ...data,
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority,
        subtasks: data.subtasks || []
      } as Task;
    } catch (err) {
      console.error('Error fetching task:', err);
      return null;
    }
  }
  
  /**
   * Search tasks by query string
   */
  async searchTasks(query: string): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .ilike('title', `%${query}%`);

      if (error) {
        console.error('Error searching tasks:', error);
        return [];
      }

      // Cast the status to TaskStatus type
      return (data || []).map(task => ({
        ...task,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority
      })) as Task[];
    } catch (error) {
      console.error('Error in searchTasks:', error);
      return [];
    }
  }
  
  /**
   * Create a new task
   */
  async createTask(taskData: TaskFormData): Promise<Task | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      
      const taskWithUser = {
        ...taskData,
        user_id: user.id,
        status: taskData.status || 'pending'
      };
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskWithUser])
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        ...data,
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority
      } as Task;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  }
  
  /**
   * Update an existing task
   */
  async updateTask(taskId: string, taskData: Partial<TaskFormData>): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', taskId)
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        ...data,
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority
      } as Task;
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  }
  
  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  }
  
  /**
   * Complete a task
   */
  async completeTask(taskId: string): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        ...data,
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority
      } as Task;
    } catch (error) {
      console.error('Error completing task:', error);
      return null;
    }
  }
}

export const taskRepository = new TaskRepository();
