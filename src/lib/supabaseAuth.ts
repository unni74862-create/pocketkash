import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age: number;
  role: 'studying' | 'working' | 'both';
  hasIncome: boolean;
  monthlyAllowance: number;
  salary: number;
  sideIncome: number;
  spendingFrequency: 'rarely' | 'sometimes' | 'often' | 'always';
  plansBeforeSpending: boolean;
  topSpendingCategory: string;
  dailyLimit: number;
  weeklyLimit: number;
  monthlyLimit: number;
  isOnboarded: boolean;
  created_at?: string;
  updated_at?: string;
}

// Sign up a new user
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error };
  }
};

// Sign in user
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error };
  }
};

// Sign out user
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error };
  }
};

// Get current session
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { success: true, session: data.session };
  } catch (error) {
    console.error('Get session error:', error);
    return { success: false, error };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Get user error:', error);
    return { success: false, error };
  }
};

// Create or update user profile
export const upsertUserProfile = async (userId: string, profile: Partial<UserProfile>) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        ...profile,
        updated_at: new Date().toISOString(),
      });
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Upsert profile error:', error);
    return { success: false, error };
  }
};

// Get user profile
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return { success: true, profile: data };
  } catch (error) {
    console.error('Get profile error:', error);
    return { success: false, error };
  }
};
