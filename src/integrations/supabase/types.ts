export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          accel: number | null
          availability: string
          body_type: string | null
          brand: string
          brand_slug: string
          canonical_url: string | null
          created_at: string
          description: string | null
          detail_gallery: Json
          drive_type: string | null
          engine: string | null
          exterior_colour: string | null
          exterior_gallery: Json
          faqs: Json
          featured: boolean
          features: Json
          fuel: string | null
          gallery: Json
          horsepower: number | null
          id: string
          image: string | null
          interior_colour: string | null
          interior_gallery: Json
          meta_description: string | null
          mileage: number | null
          model: string | null
          new_arrival: boolean
          noindex: boolean
          og_image: string | null
          price: number | null
          published: boolean
          seo_title: string | null
          sequence_360: Json
          slug: string
          sold: boolean
          sort_order: number
          specs: Json
          title: string
          top_speed: number | null
          torque: number | null
          transmission: string | null
          updated_at: string
          video_url: string | null
          wheel_gallery: Json
          year: number | null
        }
        Insert: {
          accel?: number | null
          availability?: string
          body_type?: string | null
          brand: string
          brand_slug: string
          canonical_url?: string | null
          created_at?: string
          description?: string | null
          detail_gallery?: Json
          drive_type?: string | null
          engine?: string | null
          exterior_colour?: string | null
          exterior_gallery?: Json
          faqs?: Json
          featured?: boolean
          features?: Json
          fuel?: string | null
          gallery?: Json
          horsepower?: number | null
          id?: string
          image?: string | null
          interior_colour?: string | null
          interior_gallery?: Json
          meta_description?: string | null
          mileage?: number | null
          model?: string | null
          new_arrival?: boolean
          noindex?: boolean
          og_image?: string | null
          price?: number | null
          published?: boolean
          seo_title?: string | null
          sequence_360?: Json
          slug: string
          sold?: boolean
          sort_order?: number
          specs?: Json
          title: string
          top_speed?: number | null
          torque?: number | null
          transmission?: string | null
          updated_at?: string
          video_url?: string | null
          wheel_gallery?: Json
          year?: number | null
        }
        Update: {
          accel?: number | null
          availability?: string
          body_type?: string | null
          brand?: string
          brand_slug?: string
          canonical_url?: string | null
          created_at?: string
          description?: string | null
          detail_gallery?: Json
          drive_type?: string | null
          engine?: string | null
          exterior_colour?: string | null
          exterior_gallery?: Json
          faqs?: Json
          featured?: boolean
          features?: Json
          fuel?: string | null
          gallery?: Json
          horsepower?: number | null
          id?: string
          image?: string | null
          interior_colour?: string | null
          interior_gallery?: Json
          meta_description?: string | null
          mileage?: number | null
          model?: string | null
          new_arrival?: boolean
          noindex?: boolean
          og_image?: string | null
          price?: number | null
          published?: boolean
          seo_title?: string | null
          sequence_360?: Json
          slug?: string
          sold?: boolean
          sort_order?: number
          specs?: Json
          title?: string
          top_speed?: number | null
          torque?: number | null
          transmission?: string | null
          updated_at?: string
          video_url?: string | null
          wheel_gallery?: Json
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "manager" | "editor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "editor"],
    },
  },
} as const
