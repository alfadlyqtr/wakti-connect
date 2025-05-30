
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse } from './types';
import { PostgrestQueryBuilder } from '@supabase/postgrest-js';
import { Database } from '@/integrations/supabase/types';

export class BaseService {
  protected async get<T>(
    path: keyof Database['public']['Tables'] | string,
    query?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      // Use type assertion to force TypeScript to accept the table name
      // This is safe because we validate the tables at runtime via Supabase
      const from = supabase.from(path as any);
      let request = from.select('*');
      
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
    path: keyof Database['public']['Tables'] | string,
    data: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      // Use type assertion to force TypeScript to accept the table name
      const response = await supabase
        .from(path as any)
        .insert(data)
        .select()
        .single();
      
      const { data: responseData, error } = response;
        
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
    path: keyof Database['public']['Tables'] | string,
    id: string,
    data: Partial<T>
  ): Promise<ApiResponse<T>> {
    try {
      // Use type assertion to force TypeScript to accept the table name
      const response = await supabase
        .from(path as any)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      const { data: responseData, error } = response;
        
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
    path: keyof Database['public']['Tables'] | string,
    id: string
  ): Promise<ApiResponse<null>> {
    try {
      // Use type assertion to force TypeScript to accept the table name
      const { error } = await supabase
        .from(path as any)
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
