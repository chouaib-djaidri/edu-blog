export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      blog_comments: {
        Row: {
          blog_id: string;
          content: string;
          created_at: string | null;
          id: string;
          parent_id: string | null;
          user_id: string;
        };
        Insert: {
          blog_id: string;
          content: string;
          created_at?: string | null;
          id?: string;
          parent_id?: string | null;
          user_id: string;
        };
        Update: {
          blog_id?: string;
          content?: string;
          created_at?: string | null;
          id?: string;
          parent_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_comments_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_comments_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs_with_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_comments_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "blog_comments";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_likes: {
        Row: {
          blog_id: string;
          created_at: string | null;
          id: string;
          user_id: string;
        };
        Insert: {
          blog_id: string;
          created_at?: string | null;
          id?: string;
          user_id: string;
        };
        Update: {
          blog_id?: string;
          created_at?: string | null;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_likes_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_likes_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs_with_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_quiz_correct_answers: {
        Row: {
          answer_data: Json;
          created_at: string | null;
          id: string;
          quiz_id: string;
          updated_at: string | null;
        };
        Insert: {
          answer_data: Json;
          created_at?: string | null;
          id?: string;
          quiz_id: string;
          updated_at?: string | null;
        };
        Update: {
          answer_data?: Json;
          created_at?: string | null;
          id?: string;
          quiz_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "blog_quiz_correct_answers_quiz_id_fkey";
            columns: ["quiz_id"];
            isOneToOne: true;
            referencedRelation: "blog_quizzes";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_quiz_user_answers: {
        Row: {
          created_at: string | null;
          id: string;
          quiz_id: string;
          user_answer: Json;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          quiz_id: string;
          user_answer: Json;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          quiz_id?: string;
          user_answer?: Json;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_quiz_user_answers_quiz_id_fkey";
            columns: ["quiz_id"];
            isOneToOne: false;
            referencedRelation: "blog_quizzes";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_quizzes: {
        Row: {
          blog_id: string;
          created_at: string | null;
          data: Json;
          id: string;
          question: string;
          type: Database["public"]["Enums"]["quiz_type"];
          updated_at: string | null;
        };
        Insert: {
          blog_id: string;
          created_at?: string | null;
          data: Json;
          id?: string;
          question: string;
          type: Database["public"]["Enums"]["quiz_type"];
          updated_at?: string | null;
        };
        Update: {
          blog_id?: string;
          created_at?: string | null;
          data?: Json;
          id?: string;
          question?: string;
          type?: Database["public"]["Enums"]["quiz_type"];
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "blog_quizzes_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: true;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_quizzes_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: true;
            referencedRelation: "blogs_with_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_views: {
        Row: {
          blog_id: string;
          id: string;
          user_id: string | null;
          viewed_at: string | null;
        };
        Insert: {
          blog_id: string;
          id?: string;
          user_id?: string | null;
          viewed_at?: string | null;
        };
        Update: {
          blog_id?: string;
          id?: string;
          user_id?: string | null;
          viewed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "blog_views_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_views_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs_with_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      blogs: {
        Row: {
          content: Json;
          cover_url: string;
          created_at: string | null;
          description: string;
          id: string;
          level: Database["public"]["Enums"]["english_level"];
          slug: string;
          title: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          content: Json;
          cover_url: string;
          created_at?: string | null;
          description: string;
          id?: string;
          level?: Database["public"]["Enums"]["english_level"];
          slug: string;
          title: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          content?: Json;
          cover_url?: string;
          created_at?: string | null;
          description?: string;
          id?: string;
          level?: Database["public"]["Enums"]["english_level"];
          slug?: string;
          title?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      feedbacks: {
        Row: {
          created_at: string | null;
          feedback: string | null;
          id: string;
          rating: number;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          feedback?: string | null;
          id?: string;
          rating: number;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          feedback?: string | null;
          id?: string;
          rating?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      level_requirements: {
        Row: {
          created_at: string | null;
          description: string;
          level: Database["public"]["Enums"]["english_level"];
          level_order: number;
          min_points: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description: string;
          level: Database["public"]["Enums"]["english_level"];
          level_order: number;
          min_points: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string;
          level?: Database["public"]["Enums"]["english_level"];
          level_order?: number;
          min_points?: number;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          blog_id: string;
          created_at: string | null;
          id: string;
          read: boolean | null;
          recipient_id: string;
          sender_id: string | null;
          type: string;
        };
        Insert: {
          blog_id: string;
          created_at?: string | null;
          id?: string;
          read?: boolean | null;
          recipient_id: string;
          sender_id?: string | null;
          type: string;
        };
        Update: {
          blog_id?: string;
          created_at?: string | null;
          id?: string;
          read?: boolean | null;
          recipient_id?: string;
          sender_id?: string | null;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs_with_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          full_name: string;
          on_boarding_status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          full_name: string;
          on_boarding_status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string;
          on_boarding_status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      role_permissions: {
        Row: {
          id: number;
          permission: Database["public"]["Enums"]["app_permission"];
          role: Database["public"]["Enums"]["app_role"];
        };
        Insert: {
          id?: number;
          permission: Database["public"]["Enums"]["app_permission"];
          role: Database["public"]["Enums"]["app_role"];
        };
        Update: {
          id?: number;
          permission?: Database["public"]["Enums"]["app_permission"];
          role?: Database["public"]["Enums"]["app_role"];
        };
        Relationships: [];
      };
      test_quiz_correct_answers: {
        Row: {
          answer_data: Json;
          created_at: string | null;
          id: string;
          quiz_id: string;
          updated_at: string | null;
        };
        Insert: {
          answer_data: Json;
          created_at?: string | null;
          id?: string;
          quiz_id: string;
          updated_at?: string | null;
        };
        Update: {
          answer_data?: Json;
          created_at?: string | null;
          id?: string;
          quiz_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "test_quiz_correct_answers_quiz_id_fkey";
            columns: ["quiz_id"];
            isOneToOne: true;
            referencedRelation: "test_quizzes";
            referencedColumns: ["id"];
          },
        ];
      };
      test_quizzes: {
        Row: {
          created_at: string | null;
          data: Json;
          id: string;
          question: string;
          quiz_order: number;
          test_id: string;
          type: Database["public"]["Enums"]["quiz_type"];
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          data: Json;
          id?: string;
          question: string;
          quiz_order: number;
          test_id: string;
          type: Database["public"]["Enums"]["quiz_type"];
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          data?: Json;
          id?: string;
          question?: string;
          quiz_order?: number;
          test_id?: string;
          type?: Database["public"]["Enums"]["quiz_type"];
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "test_quizzes_test_id_fkey";
            columns: ["test_id"];
            isOneToOne: false;
            referencedRelation: "tests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "test_quizzes_test_id_fkey";
            columns: ["test_id"];
            isOneToOne: false;
            referencedRelation: "tests_with_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      test_user_answers: {
        Row: {
          created_at: string | null;
          id: string;
          quiz_id: string;
          user_answer: Json;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          quiz_id: string;
          user_answer: Json;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          quiz_id?: string;
          user_answer?: Json;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "test_user_answers_quiz_id_fkey";
            columns: ["quiz_id"];
            isOneToOne: false;
            referencedRelation: "test_quizzes";
            referencedColumns: ["id"];
          },
        ];
      };
      tests: {
        Row: {
          categories: string[];
          cover_url: string;
          created_at: string | null;
          description: string;
          id: string;
          level: Database["public"]["Enums"]["english_level"];
          slug: string;
          title: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          categories: string[];
          cover_url: string;
          created_at?: string | null;
          description: string;
          id?: string;
          level?: Database["public"]["Enums"]["english_level"];
          slug: string;
          title: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          categories?: string[];
          cover_url?: string;
          created_at?: string | null;
          description?: string;
          id?: string;
          level?: Database["public"]["Enums"]["english_level"];
          slug?: string;
          title?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      user_points_history: {
        Row: {
          created_at: string | null;
          id: string;
          points_earned: number;
          source_type: Database["public"]["Enums"]["points_source_type"];
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          points_earned: number;
          source_type: Database["public"]["Enums"]["points_source_type"];
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          points_earned?: number;
          source_type?: Database["public"]["Enums"]["points_source_type"];
          user_id?: string;
        };
        Relationships: [];
      };
      user_progress: {
        Row: {
          created_at: string | null;
          current_level: Database["public"]["Enums"]["english_level"];
          id: string;
          quizzes_completed: number;
          streak_days: number;
          tests_completed: number;
          total_points: number;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          current_level?: Database["public"]["Enums"]["english_level"];
          id?: string;
          quizzes_completed?: number;
          streak_days?: number;
          tests_completed?: number;
          total_points?: number;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          current_level?: Database["public"]["Enums"]["english_level"];
          id?: string;
          quizzes_completed?: number;
          streak_days?: number;
          tests_completed?: number;
          total_points?: number;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: number;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: number;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: number;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      user_saved_blogs: {
        Row: {
          blog_id: string;
          created_at: string | null;
          id: string;
          user_id: string;
        };
        Insert: {
          blog_id: string;
          created_at?: string | null;
          id?: string;
          user_id: string;
        };
        Update: {
          blog_id?: string;
          created_at?: string | null;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_saved_blogs_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_saved_blogs_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs_with_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      blogs_with_profiles: {
        Row: {
          author_avatar_url: string | null;
          author_full_name: string | null;
          content: Json | null;
          cover_url: string | null;
          created_at: string | null;
          description: string | null;
          id: string | null;
          level: Database["public"]["Enums"]["english_level"] | null;
          quiz: Json | null;
          slug: string | null;
          title: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Relationships: [];
      };
      notification_details: {
        Row: {
          blog_id: string | null;
          blog_slug: string | null;
          blog_title: string | null;
          created_at: string | null;
          id: string | null;
          read: boolean | null;
          recipient_id: string | null;
          sender_email: string | null;
          sender_id: string | null;
          type: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs_with_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tests_with_profiles: {
        Row: {
          author_avatar_url: string | null;
          author_full_name: string | null;
          categories: string[] | null;
          cover_url: string | null;
          created_at: string | null;
          description: string | null;
          id: string | null;
          level: Database["public"]["Enums"]["english_level"] | null;
          questions: Json | null;
          slug: string | null;
          title: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"];
        };
        Returns: boolean;
      };
      change_password: {
        Args: { current_password: string; new_password: string };
        Returns: string;
      };
      check_email_confirmation_cooldown: {
        Args: { user_email: string };
        Returns: number;
      };
      check_email_confirmation_token: {
        Args: { user_email: string };
        Returns: string;
      };
      check_reset_password_cooldown: {
        Args: { user_email: string };
        Returns: number;
      };
      check_reset_password_token: {
        Args: { user_email: string };
        Returns: string;
      };
      check_user_password: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      custom_access_token_hook: {
        Args: { event: Json };
        Returns: Json;
      };
      get_all_users: {
        Args: {
          page_number?: number;
          page_size?: number;
          search_term?: string;
          search_levels?: string[];
          search_roles?: string[];
        };
        Returns: {
          id: string;
          email: string;
          role: string;
          full_name: string;
          avatar_url: string;
          level: string;
          created_at: string;
          updated_at: string;
        }[];
      };
      get_blog_author: {
        Args: { blog_uuid: string };
        Returns: string;
      };
      get_comment_author: {
        Args: { comment_uuid: string };
        Returns: string;
      };
      get_session_amr: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      get_unread_notification_count: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      get_users_count: {
        Args: {
          search_term?: string;
          search_levels?: string[];
          search_roles?: string[];
        };
        Returns: number;
      };
      mark_all_notifications_read: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      mark_notification_read: {
        Args: { notification_id: string };
        Returns: boolean;
      };
      update_all_streaks: {
        Args: Record<PropertyKey, never>;
        Returns: {
          users_updated: number;
          streaks_reset: number;
          streaks_incremented: number;
        }[];
      };
    };
    Enums: {
      app_permission:
        | "profiles.insert"
        | "profiles.update"
        | "profiles.delete"
        | "tests.insert"
        | "tests_with_profiles.all"
        | "tests.delete"
        | "test_quizzes.insert"
        | "user_progress.select"
        | "test_quizzes.delete"
        | "test_quiz_correct_answers.insert"
        | "user_progress.insert"
        | "test_quiz_correct_answers.delete"
        | "user_progress.update"
        | "user_progress.delete"
        | "user_points_history.select"
        | "user_points_history.insert"
        | "user_points_history.update"
        | "user_points_history.delete"
        | "blogs.insert"
        | "blogs.delete"
        | "blog_quizzes.insert"
        | "blog_quizzes.delete"
        | "blog_quiz_correct_answers.insert"
        | "blog_quiz_correct_answers.delete"
        | "blogs_with_profiles.all"
        | "feedbacks.select"
        | "feedbacks.delete";
      app_role: "admin" | "creator";
      english_level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
      points_source_type: "blog_quiz" | "test" | "initial";
      quiz_type: "one_option" | "one_image" | "order_words" | "match";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_permission: [
        "profiles.insert",
        "profiles.update",
        "profiles.delete",
        "tests.insert",
        "tests_with_profiles.all",
        "tests.delete",
        "test_quizzes.insert",
        "user_progress.select",
        "test_quizzes.delete",
        "test_quiz_correct_answers.insert",
        "user_progress.insert",
        "test_quiz_correct_answers.delete",
        "user_progress.update",
        "user_progress.delete",
        "user_points_history.select",
        "user_points_history.insert",
        "user_points_history.update",
        "user_points_history.delete",
        "blogs.insert",
        "blogs.delete",
        "blog_quizzes.insert",
        "blog_quizzes.delete",
        "blog_quiz_correct_answers.insert",
        "blog_quiz_correct_answers.delete",
        "blogs_with_profiles.all",
        "feedbacks.select",
        "feedbacks.delete",
      ],
      app_role: ["admin", "creator"],
      english_level: ["A1", "A2", "B1", "B2", "C1", "C2"],
      points_source_type: ["blog_quiz", "test", "initial"],
      quiz_type: ["one_option", "one_image", "order_words", "match"],
    },
  },
} as const;
