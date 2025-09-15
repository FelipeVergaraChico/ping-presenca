/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import type { AuthState, User } from '../types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulação de API (na implementação real, conecte com o backend)
      // await new Promise(resolve => setTimeout(resolve, 1000));
      const user: User = { 
        id: '1', 
        name: email.split('@')[0], 
        email, 
        role: email.includes('professor') ? 'professor' : 'student' 
      };
      const token = 'fake-jwt-token';
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      return true;
    } catch (error) {
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false 
    });
  },

  checkAuth: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ 
          user, 
          token, 
          isAuthenticated: true 
        });
        return true;
      } catch (error) {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
        return false;
      }
    }
    return false;
  }
}));
