import { create } from 'zustand';
import { User } from '@/types';
import { supabase, getCurrentUser, signIn, signOut } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { user } = await getCurrentUser();
      set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch user data',
        isLoading: false
      });
    }
  },
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) throw new Error(error.message);
      
      if (data?.user) {
        const { user } = await getCurrentUser();
        set({ 
          user, 
          isAuthenticated: true,
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false
      });
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    try {
      const { error } = await signOut();
      if (error) throw new Error(error.message);
      
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Logout failed',
        isLoading: false
      });
    }
  }
}));