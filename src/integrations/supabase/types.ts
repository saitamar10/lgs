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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_premium: boolean | null
          name: string
          requirement_type: string | null
          requirement_value: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_premium?: boolean | null
          name: string
          requirement_type?: string | null
          requirement_value?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_premium?: boolean | null
          name?: string
          requirement_type?: string | null
          requirement_value?: number | null
        }
        Relationships: []
      }
      coach_conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coach_message_limits: {
        Row: {
          created_at: string
          id: string
          message_count: number
          reset_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_count?: number
          reset_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_count?: number
          reset_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coach_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "coach_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_tasks: {
        Row: {
          coin_reward: number
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          target_count: number
          task_type: string
          title: string
          xp_reward: number
        }
        Insert: {
          coin_reward?: number
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          target_count?: number
          task_type?: string
          title: string
          xp_reward?: number
        }
        Update: {
          coin_reward?: number
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          target_count?: number
          task_type?: string
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      mock_exams: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          title: string
          total_questions: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          title: string
          total_questions?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          title?: string
          total_questions?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          coins: number | null
          created_at: string
          display_name: string | null
          id: string
          last_activity_date: string | null
          streak_days: number | null
          total_xp: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          coins?: number | null
          created_at?: string
          display_name?: string | null
          id?: string
          last_activity_date?: string | null
          streak_days?: number | null
          total_xp?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          coins?: number | null
          created_at?: string
          display_name?: string | null
          id?: string
          last_activity_date?: string | null
          streak_days?: number | null
          total_xp?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_answer: number
          created_at: string
          difficulty: number | null
          explanation: string | null
          id: string
          image_url: string | null
          options: Json
          question_text: string
          unit_id: string
          xp_value: number | null
        }
        Insert: {
          correct_answer: number
          created_at?: string
          difficulty?: number | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          options: Json
          question_text: string
          unit_id: string
          xp_value?: number | null
        }
        Update: {
          correct_answer?: number
          created_at?: string
          difficulty?: number | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          options?: Json
          question_text?: string
          unit_id?: string
          xp_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          completed_at: string
          id: string
          score: number | null
          total_questions: number | null
          unit_id: string
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          completed_at?: string
          id?: string
          score?: number | null
          total_questions?: number | null
          unit_id: string
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          completed_at?: string
          id?: string
          score?: number | null
          total_questions?: number | null
          unit_id?: string
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_items: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          item_type: string
          name: string
          price_coins: number
          price_xp: number
          value: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          item_type: string
          name: string
          price_coins?: number
          price_xp?: number
          value?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          item_type?: string
          name?: string
          price_coins?: number
          price_xp?: number
          value?: number
        }
        Relationships: []
      }
      study_plans: {
        Row: {
          created_at: string
          daily_goal_xp: number | null
          exam_date: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_goal_xp?: number | null
          exam_date: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_goal_xp?: number | null
          exam_date?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          order_index: number | null
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          order_index?: number | null
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          order_index?: number | null
          slug?: string
        }
        Relationships: []
      }
      units: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          order_index: number | null
          slug: string
          subject_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          order_index?: number | null
          slug: string
          subject_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          order_index?: number | null
          slug?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_hearts: {
        Row: {
          created_at: string
          hearts: number
          id: string
          last_heart_lost_at: string | null
          max_hearts: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hearts?: number
          id?: string
          last_heart_lost_at?: string | null
          max_hearts?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hearts?: number
          id?: string
          last_heart_lost_at?: string | null
          max_hearts?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_inventory: {
        Row: {
          created_at: string
          id: string
          item_type: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_type: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_type?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_mock_exam_attempts: {
        Row: {
          answers: Json | null
          completed_at: string | null
          created_at: string
          exam_id: string
          id: string
          score: number | null
          started_at: string
          total_correct: number | null
          total_empty: number | null
          total_wrong: number | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string
          exam_id: string
          id?: string
          score?: number | null
          started_at?: string
          total_correct?: number | null
          total_empty?: number | null
          total_wrong?: number | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string
          exam_id?: string
          id?: string
          score?: number | null
          started_at?: string
          total_correct?: number | null
          total_empty?: number | null
          total_wrong?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_mock_exam_attempts_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "mock_exams"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          attempts_count: number | null
          best_score: number | null
          completed: boolean | null
          easy_completions: number | null
          exam_completed: boolean | null
          hard_completions: number | null
          id: string
          medium_completions: number | null
          unit_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts_count?: number | null
          best_score?: number | null
          completed?: boolean | null
          easy_completions?: number | null
          exam_completed?: boolean | null
          hard_completions?: number | null
          id?: string
          medium_completions?: number | null
          unit_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts_count?: number | null
          best_score?: number | null
          completed?: boolean | null
          easy_completions?: number | null
          exam_completed?: boolean | null
          hard_completions?: number | null
          id?: string
          medium_completions?: number | null
          unit_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      user_streaks: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_login_date: string | null
          longest_streak: number
          streak_freeze_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_login_date?: string | null
          longest_streak?: number
          streak_freeze_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_login_date?: string | null
          longest_streak?: number
          streak_freeze_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          plan_type: string
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          plan_type?: string
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          plan_type?: string
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_task_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          progress: number
          task_date: string
          task_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number
          task_date?: string
          task_id: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number
          task_date?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_task_progress_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "daily_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_vocabulary_progress: {
        Row: {
          correct_count: number
          created_at: string
          id: string
          incorrect_count: number
          last_reviewed_at: string | null
          mastery_level: number
          next_review_at: string | null
          updated_at: string
          user_id: string
          word_id: string
        }
        Insert: {
          correct_count?: number
          created_at?: string
          id?: string
          incorrect_count?: number
          last_reviewed_at?: string | null
          mastery_level?: number
          next_review_at?: string | null
          updated_at?: string
          user_id: string
          word_id: string
        }
        Update: {
          correct_count?: number
          created_at?: string
          id?: string
          incorrect_count?: number
          last_reviewed_at?: string | null
          mastery_level?: number
          next_review_at?: string | null
          updated_at?: string
          user_id?: string
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_vocabulary_progress_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "vocabulary_words"
            referencedColumns: ["id"]
          },
        ]
      }
      vocabulary_words: {
        Row: {
          category: string | null
          created_at: string
          difficulty: number | null
          example_sentence: string | null
          id: string
          meaning: string
          pronunciation: string | null
          subject_id: string | null
          word: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          difficulty?: number | null
          example_sentence?: string | null
          id?: string
          meaning: string
          pronunciation?: string | null
          subject_id?: string | null
          word: string
        }
        Update: {
          category?: string | null
          created_at?: string
          difficulty?: number | null
          example_sentence?: string | null
          id?: string
          meaning?: string
          pronunciation?: string | null
          subject_id?: string | null
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_words_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      weak_topics: {
        Row: {
          created_at: string | null
          id: string
          mistake_count: number | null
          subject_id: string
          subject_name: string
          unit_id: string
          unit_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mistake_count?: number | null
          subject_id: string
          subject_name: string
          unit_id: string
          unit_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mistake_count?: number | null
          subject_id?: string
          subject_name?: string
          unit_id?: string
          unit_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "weak_topics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weak_topics_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
