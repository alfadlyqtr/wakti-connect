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
      access_control_manager: {
        Row: {
          business_id: string | null
          created_at: string
          id: string
          permissions: Json | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          id?: string
          permissions?: Json | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          id?: string
          permissions?: Json | null
          role?: string
          updated_at?: string
          user_id?: string
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
          role: Database["public"]["Enums"]["ai_assistant_role"]
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
          role?: Database["public"]["Enums"]["ai_assistant_role"]
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
          role?: Database["public"]["Enums"]["ai_assistant_role"]
          suggestion_frequency?: string | null
          tone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_conversation_contexts: {
        Row: {
          created_at: string
          id: string
          last_interaction: string
          last_wakti_topic: string | null
          session_id: string
          updated_at: string
          user_id: string
          wakti_focus_level: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_interaction?: string
          last_wakti_topic?: string | null
          session_id: string
          updated_at?: string
          user_id: string
          wakti_focus_level?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_interaction?: string
          last_wakti_topic?: string | null
          session_id?: string
          updated_at?: string
          user_id?: string
          wakti_focus_level?: number
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
      ai_generated_images: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          model: string
          prompt: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          model?: string
          prompt: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          model?: string
          prompt?: string
          status?: string
          updated_at?: string
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
      ai_processed_documents: {
        Row: {
          content: string
          created_at: string
          document_name: string
          document_type: string
          extracted_entities: Json | null
          id: string
          summary: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          document_name: string
          document_type: string
          extracted_entities?: Json | null
          id?: string
          summary?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          document_name?: string
          document_type?: string
          extracted_entities?: Json | null
          id?: string
          summary?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_role_contexts: {
        Row: {
          context_content: string
          context_name: string
          created_at: string
          id: string
          is_default: boolean
          role: Database["public"]["Enums"]["ai_assistant_role"]
          updated_at: string
        }
        Insert: {
          context_content: string
          context_name: string
          created_at?: string
          id?: string
          is_default?: boolean
          role: Database["public"]["Enums"]["ai_assistant_role"]
          updated_at?: string
        }
        Update: {
          context_content?: string
          context_name?: string
          created_at?: string
          id?: string
          is_default?: boolean
          role?: Database["public"]["Enums"]["ai_assistant_role"]
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action_type: string
          created_at: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      auth_logs: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      booking_template_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean
          start_time: string
          template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean
          start_time: string
          template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean
          start_time?: string
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_template_availability_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "booking_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_template_exceptions: {
        Row: {
          created_at: string
          exception_date: string
          id: string
          is_available: boolean
          template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          exception_date: string
          id?: string
          is_available?: boolean
          template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          exception_date?: string
          id?: string
          is_available?: boolean
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_template_exceptions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "booking_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_templates: {
        Row: {
          business_id: string
          created_at: string
          default_ending_hour: number
          default_starting_hour: number
          description: string | null
          duration: number
          id: string
          is_published: boolean
          max_daily_bookings: number | null
          name: string
          price: number | null
          service_id: string | null
          staff_assigned_id: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          default_ending_hour?: number
          default_starting_hour?: number
          description?: string | null
          duration: number
          id?: string
          is_published?: boolean
          max_daily_bookings?: number | null
          name: string
          price?: number | null
          service_id?: string | null
          staff_assigned_id?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          default_ending_hour?: number
          default_starting_hour?: number
          description?: string | null
          duration?: number
          id?: string
          is_published?: boolean
          max_daily_bookings?: number | null
          name?: string
          price?: number | null
          service_id?: string | null
          staff_assigned_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_templates_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "business_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_templates_staff_assigned_id_fkey"
            columns: ["staff_assigned_id"]
            isOneToOne: false
            referencedRelation: "business_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          business_id: string
          created_at: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          description: string | null
          end_time: string
          id: string
          is_no_show: boolean | null
          no_show_at: string | null
          no_show_pending_approval: boolean | null
          price: number | null
          service_id: string | null
          staff_assigned_id: string | null
          staff_name: string | null
          start_time: string
          status: Database["public"]["Enums"]["booking_status"] | null
          template_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          description?: string | null
          end_time: string
          id?: string
          is_no_show?: boolean | null
          no_show_at?: string | null
          no_show_pending_approval?: boolean | null
          price?: number | null
          service_id?: string | null
          staff_assigned_id?: string | null
          staff_name?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          template_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          description?: string | null
          end_time?: string
          id?: string
          is_no_show?: boolean | null
          no_show_at?: string | null
          no_show_pending_approval?: boolean | null
          price?: number | null
          service_id?: string | null
          staff_assigned_id?: string | null
          staff_name?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "booking_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      business_analytics: {
        Row: {
          business_id: string
          created_at: string
          id: string
          staff_count: number
          subscriber_count: number
          task_completion_rate: number
          time_range: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          staff_count?: number
          subscriber_count?: number
          task_completion_rate?: number
          time_range?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          staff_count?: number
          subscriber_count?: number
          task_completion_rate?: number
          time_range?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_booking_activity: {
        Row: {
          bookings: number
          business_id: string
          created_at: string
          id: string
          month: string
          time_range: string
        }
        Insert: {
          bookings?: number
          business_id: string
          created_at?: string
          id?: string
          month: string
          time_range?: string
        }
        Update: {
          bookings?: number
          business_id?: string
          created_at?: string
          id?: string
          month?: string
          time_range?: string
        }
        Relationships: []
      }
      business_contact_submissions: {
        Row: {
          business_id: string
          created_at: string | null
          email: string | null
          id: string
          is_read: boolean | null
          message: string | null
          name: string
          page_id: string
          phone: string
        }
        Insert: {
          business_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          name: string
          page_id: string
          phone: string
        }
        Update: {
          business_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          name?: string
          page_id?: string
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_business_id"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_growth_data: {
        Row: {
          business_id: string
          created_at: string
          id: string
          month: string
          subscribers: number
          time_range: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          month: string
          subscribers?: number
          time_range?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          month?: string
          subscribers?: number
          time_range?: string
        }
        Relationships: []
      }
      business_page_sections: {
        Row: {
          background_color: string | null
          background_image_url: string | null
          border_radius: string | null
          created_at: string
          id: string
          is_visible: boolean | null
          padding: string | null
          page_id: string
          section_content: Json | null
          section_order: number
          section_title: string | null
          section_type: string
          text_color: string | null
          updated_at: string
        }
        Insert: {
          background_color?: string | null
          background_image_url?: string | null
          border_radius?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean | null
          padding?: string | null
          page_id: string
          section_content?: Json | null
          section_order: number
          section_title?: string | null
          section_type: string
          text_color?: string | null
          updated_at?: string
        }
        Update: {
          background_color?: string | null
          background_image_url?: string | null
          border_radius?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean | null
          padding?: string | null
          page_id?: string
          section_content?: Json | null
          section_order?: number
          section_title?: string | null
          section_type?: string
          text_color?: string | null
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
          background_color: string | null
          banner_url: string | null
          border_radius: string | null
          business_id: string
          chatbot_code: string | null
          chatbot_enabled: boolean | null
          content_max_width: string | null
          created_at: string
          description: string | null
          font_family: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          logo_url: string | null
          page_pattern: string | null
          page_slug: string | null
          page_title: string | null
          primary_color: string | null
          secondary_color: string | null
          section_spacing: string | null
          show_subscribe_button: boolean | null
          social_icons_position: string | null
          social_icons_size: string | null
          social_icons_style: string | null
          subscribe_button_position: string | null
          subscribe_button_size: string | null
          subscribe_button_style: string | null
          subscribe_button_text: string | null
          text_color: string | null
          updated_at: string
        }
        Insert: {
          background_color?: string | null
          banner_url?: string | null
          border_radius?: string | null
          business_id: string
          chatbot_code?: string | null
          chatbot_enabled?: boolean | null
          content_max_width?: string | null
          created_at?: string
          description?: string | null
          font_family?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          logo_url?: string | null
          page_pattern?: string | null
          page_slug?: string | null
          page_title?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          section_spacing?: string | null
          show_subscribe_button?: boolean | null
          social_icons_position?: string | null
          social_icons_size?: string | null
          social_icons_style?: string | null
          subscribe_button_position?: string | null
          subscribe_button_size?: string | null
          subscribe_button_style?: string | null
          subscribe_button_text?: string | null
          text_color?: string | null
          updated_at?: string
        }
        Update: {
          background_color?: string | null
          banner_url?: string | null
          border_radius?: string | null
          business_id?: string
          chatbot_code?: string | null
          chatbot_enabled?: boolean | null
          content_max_width?: string | null
          created_at?: string
          description?: string | null
          font_family?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          logo_url?: string | null
          page_pattern?: string | null
          page_slug?: string | null
          page_title?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          section_spacing?: string | null
          show_subscribe_button?: boolean | null
          social_icons_position?: string | null
          social_icons_size?: string | null
          social_icons_style?: string | null
          subscribe_button_position?: string | null
          subscribe_button_size?: string | null
          subscribe_button_style?: string | null
          subscribe_button_text?: string | null
          text_color?: string | null
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
      business_service_distribution: {
        Row: {
          business_id: string
          created_at: string
          id: string
          service_name: string
          time_range: string
          usage_count: number
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          service_name: string
          time_range?: string
          usage_count?: number
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          service_name?: string
          time_range?: string
          usage_count?: number
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
          email: string
          id: string
          is_service_provider: boolean | null
          name: string
          permissions: Json | null
          position: string | null
          profile_image_url: string | null
          role: string
          staff_id: string
          staff_number: string | null
          status: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          email: string
          id?: string
          is_service_provider?: boolean | null
          name: string
          permissions?: Json | null
          position?: string | null
          profile_image_url?: string | null
          role?: string
          staff_id: string
          staff_number?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          email?: string
          id?: string
          is_service_provider?: boolean | null
          name?: string
          permissions?: Json | null
          position?: string | null
          profile_image_url?: string | null
          role?: string
          staff_id?: string
          staff_number?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_staff_activity: {
        Row: {
          business_id: string
          created_at: string
          hours_worked: number
          id: string
          staff_id: string
          staff_name: string
          time_range: string
        }
        Insert: {
          business_id: string
          created_at?: string
          hours_worked?: number
          id?: string
          staff_id: string
          staff_name: string
          time_range?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          hours_worked?: number
          id?: string
          staff_id?: string
          staff_name?: string
          time_range?: string
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
      meetings: {
        Row: {
          created_at: string
          date: string
          duration: number
          id: string
          language: string | null
          location: string | null
          summary: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          duration: number
          id?: string
          language?: string | null
          location?: string | null
          summary: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          duration?: number
          id?: string
          language?: string | null
          location?: string | null
          summary?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          audio_url: string | null
          content: string | null
          created_at: string
          id: string
          image_url: string | null
          is_read: boolean
          message_type: string
          recipient_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_read?: boolean
          message_type?: string
          recipient_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_read?: boolean
          message_type?: string
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
          auto_add_staff_to_contacts: boolean | null
          auto_approve_contacts: boolean | null
          avatar_url: string | null
          business_address: string | null
          business_name: string | null
          business_type: string | null
          city: string | null
          country: string | null
          created_at: string
          currency_preference: string | null
          date_of_birth: string | null
          display_name: string | null
          email: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_active: boolean
          is_searchable: boolean | null
          last_login_at: string | null
          occupation: string | null
          po_box: string | null
          postal_code: string | null
          state_province: string | null
          street_address: string | null
          telephone: string | null
          theme_preference: string | null
          updated_at: string
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"]
          auto_add_staff_to_contacts?: boolean | null
          auto_approve_contacts?: boolean | null
          avatar_url?: string | null
          business_address?: string | null
          business_name?: string | null
          business_type?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          currency_preference?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          is_active?: boolean
          is_searchable?: boolean | null
          last_login_at?: string | null
          occupation?: string | null
          po_box?: string | null
          postal_code?: string | null
          state_province?: string | null
          street_address?: string | null
          telephone?: string | null
          theme_preference?: string | null
          updated_at?: string
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          auto_add_staff_to_contacts?: boolean | null
          auto_approve_contacts?: boolean | null
          avatar_url?: string | null
          business_address?: string | null
          business_name?: string | null
          business_type?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          currency_preference?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean
          is_searchable?: boolean | null
          last_login_at?: string | null
          occupation?: string | null
          po_box?: string | null
          postal_code?: string | null
          state_province?: string | null
          street_address?: string | null
          telephone?: string | null
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
        Relationships: []
      }
      super_admins: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
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
          archive_reason: string | null
          archived_at: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          due_time: string | null
          id: string
          is_recurring: boolean | null
          is_recurring_instance: boolean | null
          parent_recurring_id: string | null
          priority: string
          snooze_count: number | null
          snoozed_until: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          archive_reason?: string | null
          archived_at?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          id?: string
          is_recurring?: boolean | null
          is_recurring_instance?: boolean | null
          parent_recurring_id?: string | null
          priority?: string
          snooze_count?: number | null
          snoozed_until?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          archive_reason?: string | null
          archived_at?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          id?: string
          is_recurring?: boolean | null
          is_recurring_instance?: boolean | null
          parent_recurring_id?: string | null
          priority?: string
          snooze_count?: number | null
          snoozed_until?: string | null
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
          due_date: string | null
          due_time: string | null
          id: string
          is_completed: boolean
          task_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          due_date?: string | null
          due_time?: string | null
          id?: string
          is_completed?: boolean
          task_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          due_date?: string | null
          due_time?: string | null
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
        Relationships: []
      }
      user_feedback: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
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
      admin_delete_user: {
        Args: { user_id: string }
        Returns: boolean
      }
      admin_get_all_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          full_name: string
          account_type: string
          is_active: boolean
          created_at: string
          last_login_at: string
        }[]
      }
      admin_reset_user_password: {
        Args: { user_email: string }
        Returns: boolean
      }
      admin_toggle_user_active: {
        Args: { user_id: string; is_active: boolean }
        Returns: boolean
      }
      admin_update_user_role: {
        Args: { user_id: string; new_role: string }
        Returns: boolean
      }
      approve_no_show: {
        Args: { booking_id_param: string }
        Returns: boolean
      }
      can_create_event: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      can_use_ai_assistant: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_contact_request: {
        Args: { user_id_param: string; contact_id_param: string }
        Returns: {
          request_exists: boolean
          request_status: string
        }[]
      }
      check_if_task_shared_with_user: {
        Args: { task_id: string; user_uuid: string }
        Returns: boolean
      }
      check_own_staff_record: {
        Args: { record_id_param: string }
        Returns: boolean
      }
      check_profiles_table: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_staff_member_access: {
        Args: { business_id_param: string }
        Returns: boolean
      }
      check_table_exists: {
        Args: { table_name: string }
        Returns: boolean
      }
      complete_job_card: {
        Args: { job_card_id: string; end_timestamp: string }
        Returns: boolean
      }
      expire_old_messages: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_unique_business_slug: {
        Args: { business_name: string }
        Returns: string
      }
      get_active_staff_profiles: {
        Args: { ids: string[] }
        Returns: {
          staff_id: string
          name: string
          profile_image_url: string
        }[]
      }
      get_auth_user_account_type: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_template_available_slots: {
        Args: { template_id_param: string; date_param: string }
        Returns: {
          start_time: string
          end_time: string
        }[]
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_business_owner: {
        Args: { business_id: string }
        Returns: boolean
      }
      is_business_owner_or_staff: {
        Args: { business_uuid: string }
        Returns: boolean
      }
      is_business_owner_secure: {
        Args: { business_id_param: string }
        Returns: boolean
      }
      is_own_staff_record: {
        Args: { record_id: string }
        Returns: boolean
      }
      is_own_staff_record_secure: {
        Args: { record_id_param: string }
        Returns: boolean
      }
      is_staff_member: {
        Args: { business_id: string }
        Returns: boolean
      }
      is_staff_of_business_secure: {
        Args: { business_id_param: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      mark_booking_no_show: {
        Args: { booking_id_param: string }
        Returns: boolean
      }
      populate_access_control: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      populate_initial_business_analytics: {
        Args: { business_id_param: string }
        Returns: undefined
      }
      refresh_business_analytics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reject_no_show: {
        Args: { booking_id_param: string }
        Returns: boolean
      }
      search_users: {
        Args: { search_query: string }
        Returns: {
          id: string
          full_name: string
          display_name: string
          email: string
          avatar_url: string
          account_type: string
          business_name: string
        }[]
      }
      todo_item_belongs_to_user: {
        Args: { todo_item_id: string }
        Returns: boolean
      }
      update_existing_staff_contacts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      user_owns_service: {
        Args: { service_id: string }
        Returns: boolean
      }
      user_owns_staff: {
        Args: { staff_id: string }
        Returns: boolean
      }
    }
    Enums: {
      account_type: "free" | "individual" | "business" | "staff" | "super-admin"
      ai_assistant_role:
        | "student"
        | "employee"
        | "writer"
        | "business_owner"
        | "general"
      appointment_status: "scheduled" | "cancelled" | "completed"
      booking_status:
        | "pending"
        | "confirmed"
        | "cancelled"
        | "completed"
        | "no_show"
        | "in_progress"
      event_status: "draft" | "sent" | "accepted" | "declined" | "recalled"
      invitation_status: "pending" | "accepted" | "declined"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type: ["free", "individual", "business", "staff", "super-admin"],
      ai_assistant_role: [
        "student",
        "employee",
        "writer",
        "business_owner",
        "general",
      ],
      appointment_status: ["scheduled", "cancelled", "completed"],
      booking_status: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "no_show",
        "in_progress",
      ],
      event_status: ["draft", "sent", "accepted", "declined", "recalled"],
      invitation_status: ["pending", "accepted", "declined"],
    },
  },
} as const
