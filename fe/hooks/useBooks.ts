import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre?: string;
  location: string;
  isAvailable: boolean;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerMobile: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookInput {
  title: string;
  author: string;
  genre?: string;
  location: string;
  contactInfo: string;
}

export interface UpdateBookInput {
  title?: string;
  author?: string;
  genre?: string;
  location?: string;
  isAvailable?: boolean;
}

export interface SearchParams {
  query?: string;
  genre?: string;
  location?: string;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  books: T[];
  pagination: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export function useBooks(params: SearchParams = {}) {
  return useQuery<PaginatedResponse<Book>>({
    queryKey: ['books', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (params.query) searchParams.append('query', params.query);
      if (params.genre && params.genre !== 'all') searchParams.append('genre', params.genre);
      if (params.location) searchParams.append('location', params.location);
      if (params.isAvailable !== undefined) searchParams.append('isAvailable', params.isAvailable.toString());
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      
      const queryString = searchParams.toString();
      const url = queryString ? `/api/books?${queryString}` : '/api/books';
      
      try {
        const response = await api.get(url);
        // If the response is null or empty, return a default structure
        if (!response.data) {
          return {
            books: [],
            pagination: {
              totalItems: 0,
              currentPage: params.page || 1,
              pageSize: params.limit || 10,
              totalPages: 0,
              hasMore: false
            }
          };
        }
        return response.data;
      } catch (error) {
        console.error('Error fetching books:', error);
        // Return empty result on error
        return {
          books: [],
          pagination: {
            totalItems: 0,
            currentPage: params.page || 1,
            pageSize: params.limit || 10,
            totalPages: 0,
            hasMore: false
          }
        };
      }
    },
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateBookInput) => {
      const response = await api.post('/api/books', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateBookInput }) => {
      const response = await api.put(`/api/books/${id}`, input);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/books/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useUserBooks() {
  return useQuery<Book[]>({
    queryKey: ['userBooks'],
    queryFn: async () => {
      const response = await api.get('/api/users/books');
      return response.data.books;
    },
  });
} 