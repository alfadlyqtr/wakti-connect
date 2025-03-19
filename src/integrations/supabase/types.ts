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
      _metadata: {
        Row: {
          created_at: string | null
          id: number
          table_name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          table_name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          table_name?: string
        }
        Relationships: []
      }
      ai_assistant_settings: {
        Row: {
          assistant_name: string | null
          created_at: string
          enabled_features: Json | null
          id: string
          proactiveness: boolean | null
          response_length: string | null
          suggestion_frequency: string | null
          tone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assistant_name?: string | null
          created_at?: string
          enabled_features?: Json | null
          id?: string
          proactiveness?: boolean | null
          response_length?: string | null
          suggestion_frequency?: string | null
          tone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assistant_name?: string | null
          created_at?: string
          enabled_features?: Json | null
          id?: string
          proactiveness?: boolean | null
          response_length?: string | null
          suggestion_frequency?: string | null
          tone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_conversations: {
        Row: {
          created_at: string
          id: string
          message: string
          response: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          response: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          response?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_knowledge_uploads: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          business_id: string
          created_at: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          description: string | null
          end_time: string
          id: string
          service_id: string | null
          staff_assigned_id: string | null
          start_time: string
          status: Database["public"]["Enums"]["booking_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          description?: string | null
          end_time: string
          id?: string
          service_id?: string | null
          staff_assigned_id?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          description?: string | null
          end_time?: string
          id?: string
          service_id?: string | null
          staff_assigned_id?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      business_page_sections: {
        Row: {
          created_at: string
          id: string
          is_visible: boolean | null
          page_id: string
          section_content: Json | null
          section_order: number
          section_title: string | null
          section_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_visible?: boolean | null
          page_id: string
          section_content?: Json | null
          section_order: number
          section_title?: string | null
          section_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_visible?: boolean | null
          page_id?: string
          section_content?: Json | null
          section_order?: number
          section_title?: string | null
          section_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "business_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      business_pages: {
        Row: {
          banner_url: string | null
          business_id: string
          chatbot_code: string | null
          chatbot_enabled: boolean | null
          created_at: string
          description: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          logo_url: string | null
          page_slug: string | null
          page_title: string | null
          primary_color: string | null
          secondary_color: string | null
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          business_id: string
          chatbot_code?: string | null
          chatbot_enabled?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          logo_url?: string | null
          page_slug?: string | null
          page_title?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          business_id?: string
          chatbot_code?: string | null
          chatbot_enabled?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          logo_url?: string | null
          page_slug?: string | null
          page_title?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      business_section_templates: {
        Row: {
          created_at: string
          id: string
          is_system: boolean
          section_type: string
          template_content: Json
          template_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_system?: boolean
          section_type: string
          template_content: Json
          template_name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_system?: boolean
          section_type?: string
          template_content?: Json
          template_name?: string
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
      business_social_links: {
        Row: {
          business_id: string
          created_at: string
          id: string
          platform: string
          updated_at: string
          url: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          platform: string
          updated_at?: string
          url: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          platform?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      business_staff: {
        Row: {
          business_id: string
          created_at: string
          email: string | null
          id: string
          is_service_provider: boolean | null
          name: string | null
          permissions: Json | null
          position: string | null
          profile_image_url: string | null
          role: string
          staff_id: string
          staff_number: string | null
          status: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          email?: string | null
          id?: string
          is_service_provider?: boolean | null
          name?: string | null
          permissions?: Json | null
          position?: string | null
          profile_image_url?: string | null
          role?: string
          staff_id: string
          staff_number?: string | null
          status?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          email?: string | null
          id?: string
          is_service_provider?: boolean | null
          name?: string | null
          permissions?: Json | null
          position?: string | null
          profile_image_url?: string | null
          role?: string
          staff_id?: string
          staff_number?: string | null
          status?: string | null
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
      event_invitations: {
        Row: {
          created_at: string | null
          email: string | null
          event_id: string | null
          id: string
          invited_user_id: string | null
          shared_as_link: boolean | null
          status: Database["public"]["Enums"]["invitation_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          event_id?: string | null
          id?: string
          invited_user_id?: string | null
          shared_as_link?: boolean | null
          status?: Database["public"]["Enums"]["invitation_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          event_id?: string | null
          id?: string
          invited_user_id?: string | null
          shared_as_link?: boolean | null
          status?: Database["public"]["Enums"]["invitation_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_invitations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          customization: Json | null
          description: string | null
          end_time: string
          id: string
          is_all_day: boolean | null
          is_recalled: boolean | null
          location: string | null
          start_time: string
          status: Database["public"]["Enums"]["event_status"] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customization?: Json | null
          description?: string | null
          end_time: string
          id?: string
          is_all_day?: boolean | null
          is_recalled?: boolean | null
          location?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["event_status"] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          customization?: Json | null
          description?: string | null
          end_time?: string
          id?: string
          is_all_day?: boolean | null
          is_recalled?: boolean | null
          location?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["event_status"] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      job_cards: {
        Row: {
          created_at: string
          end_time: string | null
          id: string
          job_id: string
          notes: string | null
          payment_amount: number | null
          payment_method: string | null
          staff_relation_id: string
          start_time: string
          updated_at: string
          work_log_id: string | null
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          id?: string
          job_id: string
          notes?: string | null
          payment_amount?: number | null
          payment_method?: string | null
          staff_relation_id: string
          start_time?: string
          updated_at?: string
          work_log_id?: string | null
        }
        Update: {
          created_at?: string
          end_time?: string | null
          id?: string
          job_id?: string
          notes?: string | null
          payment_amount?: number | null
          payment_method?: string | null
          staff_relation_id?: string
          start_time?: string
          updated_at?: string
          work_log_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_cards_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_cards_staff_relation_id_fkey"
            columns: ["staff_relation_id"]
            isOneToOne: false
            referencedRelation: "business_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_cards_work_log_id_fkey"
            columns: ["work_log_id"]
            isOneToOne: false
            referencedRelation: "staff_work_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          business_id: string
          created_at: string
          default_price: number | null
          description: string | null
          duration: number | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          default_price?: number | null
          description?: string | null
          duration?: number | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          default_price?: number | null
          description?: string | null
          duration?: number | null
          id?: string
          name?: string
          updated_at?: string
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
          auto_approve_contacts: boolean
          avatar_url: string | null
          business_name: string | null
          created_at: string
          display_name: string | null
          full_name: string | null
          id: string
          is_searchable: boolean | null
          occupation: string | null
          theme_preference: string | null
          updated_at: string
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"]
          auto_approve_contacts?: boolean
          avatar_url?: string | null
          business_name?: string | null
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          id: string
          is_searchable?: boolean | null
          occupation?: string | null
          theme_preference?: string | null
          updated_at?: string
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          auto_approve_contacts?: boolean
          avatar_url?: string | null
          business_name?: string | null
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          id?: string
          is_searchable?: boolean | null
          occupation?: string | null
          theme_preference?: string | null
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
          staff_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          service_id: string
          staff_id: string
        }
        Update: {
          created_at?: string
          id?: string
          service_id?: string
          staff_id?: string
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
            foreignKeyName: "staff_service_assignments_staff_id_fkey"
            columns: ["staff_id"]
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
          status: string | null
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
          status?: string | null
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
          status?: string | null
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
      user_contacts: {
        Row: {
          contact_id: string
          created_at: string | null
          id: string
          staff_relation_id: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string | null
          id?: string
          staff_relation_id?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          id?: string
          staff_relation_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_contacts_staff_relation_id_fkey"
            columns: ["staff_relation_id"]
            isOneToOne: false
            referencedRelation: "business_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      user_monthly_usage: {
        Row: {
          events_created: number
          id: string
          month: number
          updated_at: string | null
          user_id: string
          year: number
        }
        Insert: {
          events_created?: number
          id?: string
          month: number
          updated_at?: string | null
          user_id: string
          year: number
        }
        Update: {
          events_created?: number
          id?: string
          month?: number
          updated_at?: string | null
          user_id?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_create_event: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      can_use_ai_assistant: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_if_task_shared_with_user: {
        Args: {
          task_id: string
          user_uuid: string
        }
        Returns: boolean
      }
      check_table_exists: {
        Args: {
          table_name: string
        }
        Returns: boolean
      }
      expire_old_messages: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_unique_business_slug: {
        Args: {
          business_name: string
        }
        Returns: string
      }
      get_auth_user_account_type: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      user_owns_service: {
        Args: {
          service_id: string
        }
        Returns: boolean
      }
      user_owns_staff: {
        Args: {
          staff_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      account_type: "free" | "individual" | "business"
      appointment_status: "scheduled" | "cancelled" | "completed"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      event_status: "draft" | "sent" | "accepted" | "declined" | "recalled"
      invitation_status: "pending" | "accepted" | "declined"
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
