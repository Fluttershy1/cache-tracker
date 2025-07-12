import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы для базы данных
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          color: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon: string;
          color: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          color?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          title: string;
          amount: number;
          category_id: string;
          date: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          amount: number;
          category_id: string;
          date: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          amount?: number;
          category_id?: string;
          date?: string;
          user_id?: string;
          created_at?: string;
        };
      };
    };
  };
} 