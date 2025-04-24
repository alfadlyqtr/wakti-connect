
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse } from './types';

export class BaseService {
  protected async get<T>(
    path: string,
    query?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      let request = supabase.from(path).select('*');
      
      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          request = request.eq(key, value);
        });
      }

      const { data, error } = await request;
      
      if (error) throw error;
      
      return {
        data: data as T,
        error: null
      };
    } catch (error) {
      console.error(`Error fetching ${path}:`, error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error occurred')
      };
    }
  }

  protected async post<T>(
    path: string,
    data: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const { data: responseData, error } = await supabase
        .from(path)
        .insert(data)
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        data: responseData as T,
        error: null
      };
    } catch (error) {
      console.error(`Error creating ${path}:`, error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error occurred')
      };
    }
  }

  protected async update<T>(
    path: string,
    id: string,
    data: Partial<T>
  ): Promise<ApiResponse<T>> {
    try {
      const { data: responseData, error } = await supabase
        .from(path)
        .update(data)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        data: responseData as T,
        error: null
      };
    } catch (error) {
      console.error(`Error updating ${path}:`, error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error occurred')
      };
    }
  }

  protected async delete(
    path: string,
    id: string
  ): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from(path)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return {
        data: null,
        error: null
      };
    } catch (error) {
      console.error(`Error deleting ${path}:`, error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error occurred')
      };
    }
  }
}
