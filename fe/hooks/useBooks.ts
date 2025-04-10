import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface Book {
  id: string;
  title: string;
  author: string;
  genre?: string;
  location: string;
  contactInfo: string;
  ownerId: string;
  ownerName: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateBookInput {
  title: string;
  author: string;
  genre?: string;
  location: string;
  contactInfo: string;
}

interface UpdateBookInput {
  title?: string;
  author?: string;
  genre?: string;
  location?: string;
  contactInfo?: string;
  isAvailable?: boolean;
}

export const useBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data } = await api.get<Book[]>('/api/books');
      return data;
    },
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBookInput) => {
      const { data } = await api.post<Book>('/api/books', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateBookInput }) => {
      const { data } = await api.patch<Book>(`/api/books/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/books/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}; 