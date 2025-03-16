export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointment_invitations: {
        Row: {
          appointment_id: string
          created_at: string
          email: string | null
          id: string
          invited_user_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          email?: string | null
          id?: string
          invited_user_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          email?: string | null
          id?: string
          invited_user_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_invitations_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          assignee_id: string | null
          created_at: string
          description: string | null
          end_time: string
          id: string
          is_all_day: boolean
          is_recurring_instance: boolean | null
          location: string | null
          parent_recurring_id: string | null
          start_time: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          is_all_day?: boolean
          is_recurring_instance?: boolean | null
          location?: string | null
          parent_recurring_id?: string | null
          start_time: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          is_all_day?: boolean
          is_recurring_instance?: boolean | null
          location?: string | null
          parent_recurring_id?: string | null
          start_time?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      business_services: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          duration: number
          id: string
          name: string
          price: number | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          duration: number
          id?: string
          name: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          name?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      business_staff: {
        Row: {
          business_id: string
          created_at: string
          id: string
          role: string
          staff_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          role?: string
          staff_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          role?: string
          staff_id?: string
        }
        Relationships: []
      }
      business_subscribers: {
        Row: {
          business_id: string
          created_at: string
          id: string
          subscriber_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          subscriber_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          subscriber_id?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          contact_id: string
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          recipient_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          related_entity_id: string | null
          related_entity_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          related_entity_id?: string | null
          related_entity_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"]
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          is_searchable: boolean | null
          updated_at: string
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"]
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_searchable?: boolean | null
          updated_at?: string
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_searchable?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      recurring_settings: {
        Row: {
          created_at: string
          created_by: string
          day_of_month: number | null
          days_of_week: string[] | null
          end_date: string | null
          entity_id: string
          entity_type: string
          frequency: string
          id: string
          interval: number
          max_occurrences: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          day_of_month?: number | null
          days_of_week?: string[] | null
          end_date?: string | null
          entity_id: string
          entity_type: string
          frequency: string
          id?: string
          interval?: number
          max_occurrences?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          day_of_month?: number | null
          days_of_week?: string[] | null
          end_date?: string | null
          entity_id?: string
          entity_type?: string
          frequency?: string
          id?: string
          interval?: number
          max_occurrences?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      shared_tasks: {
        Row: {
          created_at: string
          id: string
          shared_with: string
          task_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          shared_with: string
          task_id: string
        }
        Update: {
          created_at?: string
          id?: string
          shared_with?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_service_assignments: {
        Row: {
          created_at: string
          id: string
          service_id: string
          staff_relation_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          service_id: string
          staff_relation_id: string
        }
        Update: {
          created_at?: string
          id?: string
          service_id?: string
          staff_relation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_service_assignments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "business_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_service_assignments_staff_relation_id_fkey"
            columns: ["staff_relation_id"]
            isOneToOne: false
            referencedRelation: "business_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_work_logs: {
        Row: {
          created_at: string
          earnings: number | null
          end_time: string | null
          id: string
          notes: string | null
          staff_relation_id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          earnings?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          staff_relation_id: string
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          earnings?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          staff_relation_id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_work_logs_staff_relation_id_fkey"
            columns: ["staff_relation_id"]
            isOneToOne: false
            referencedRelation: "business_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      task_label_assignments: {
        Row: {
          created_at: string
          id: string
          label_id: string
          task_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label_id: string
          task_id: string
        }
        Update: {
          created_at?: string
          id?: string
          label_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_label_assignments_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "task_labels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_label_assignments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_labels: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          is_recurring_instance: boolean | null
          parent_recurring_id: string | null
          priority: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_recurring_instance?: boolean | null
          parent_recurring_id?: string | null
          priority?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_recurring_instance?: boolean | null
          parent_recurring_id?: string | null
          priority?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      todo_items: {
        Row: {
          content: string
          created_at: string
          id: string
          is_completed: boolean
          task_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_completed?: boolean
          task_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_completed?: boolean
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_items_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_type: "free" | "individual" | "business"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
