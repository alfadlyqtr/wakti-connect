
// Export task types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  user_id: string;
  assigned_to?: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  assigned_to?: string;
}
