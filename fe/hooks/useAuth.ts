import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: 'OWNER' | 'SEEKER';
}

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'OWNER' | 'SEEKER';
  createdAt: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post<AuthResponse>('/api/auth/login', credentials);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const { data } = await api.post<AuthResponse>('/api/auth/register', credentials);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      try {
        const { data } = await api.get<User>('/api/auth/me');
        return data;
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }
    },
    retry: false,
  });
}; 