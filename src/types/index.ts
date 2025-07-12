export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  user_id: string;
  created_at: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category_id: string;
  category?: Category;
  date: string;
  user_id: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
  category_id: string;
  date: string;
} 