
// This is a simplified version of the Database types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      business_pages: {
        Row: {
          id: string
          business_id: string
          page_title: string
          page_slug: string
          description: string | null
          logo_url: string | null
          banner_url: string | null
          primary_color: string | null
          secondary_color: string | null
          is_published: boolean
          chatbot_enabled: boolean | null
          chatbot_code: string | null
          chatbot_position: string | null
          show_subscribe_button: boolean | null
          subscribe_button_text: string | null
          created_at: string
          updated_at: string
          text_color: string | null
          font_family: string | null
          border_radius: string | null
          page_pattern: string | null
          background_color: string | null
          subscribe_button_position: string | null
          subscribe_button_style: string | null
          subscribe_button_size: string | null
          social_icons_style: string | null
          social_icons_size: string | null
          social_icons_position: string | null
          content_max_width: string | null
          section_spacing: string | null
        }
      }
      business_page_sections: {
        Row: {
          id: string
          page_id: string
          section_type: string
          section_order: number
          section_content: Json
          is_visible: boolean
          created_at: string
          updated_at: string
          background_color: string | null
          text_color: string | null
          padding: string | null
          border_radius: string | null
          background_image_url: string | null
          section_title: string | null
        }
      }
    }
  }
}
