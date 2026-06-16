import { create } from 'zustand';
import http from '../services/http';

export interface UserInfo {
  id: number;
  username: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  realName: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  student?: {
    studentNo: string;
    className: string;
    grade: string;
    department: string;
  };
  teacher?: {
    teacherNo: string;
    title?: string;
    department: string;
    managedClasses?: string[];
  };
}

interface AuthState {
  user: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  login: (username: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,

  login: async (username: string, password: string, role: string) => {
    set({ loading: true });
    try {
      const res = await http.post('/auth/login', { username, password, role });
      const { accessToken, refreshToken, user } = res.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      set({ user, accessToken, refreshToken, isAuthenticated: true, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },

  fetchProfile: async () => {
    try {
      const res = await http.get('/auth/profile');
      set({ user: res.data, isAuthenticated: true });
    } catch {
      get().logout();
    }
  },

  init: () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      get().fetchProfile();
    }
  },
}));
