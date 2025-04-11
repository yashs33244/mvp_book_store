import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Define owner interface to match backend response
interface BookOwner {
  id: string;
  name: string;
  email: string;
  mobile: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre?: string;
  location: string;
  isAvailable: boolean;
  ownerId: string;
  // These can come directly from the API or need to be derived from owner object
  ownerName?: string;
  ownerEmail?: string;
  ownerMobile?: string;
  // The owner object might be included in the API response
  owner?: BookOwner;
  imageUrl?: string;
  imageKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookInput {
  title: string;
  author: string;
  genre?: string;
  location: string;
  contactInfo: string;
  imageUrl?: string;
  imageKey?: string;
}

export interface UpdateBookInput {
  title?: string;
  author?: string;
  genre?: string;
  location?: string;
  isAvailable?: boolean;
  imageUrl?: string;
  imageKey?: string;
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
        
        // Handle case when API returns array directly instead of object with books and pagination
        if (Array.isArray(response.data)) {
          console.log('API returned array directly, adapting format');
          
          // Transform books to ensure consistent format
          const transformedBooks = response.data.map(book => formatBookData(book));
          
          return {
            books: transformedBooks,
            pagination: {
              totalItems: response.data.length,
              currentPage: params.page || 1,
              pageSize: params.limit || 10,
              totalPages: 1,
              hasMore: false
            }
          };
        }
        
        // Transform books in the standard response format
        if (response.data.books) {
          response.data.books = response.data.books.map((book:any) => formatBookData(book));
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

// Updated to use explicit typing
function formatBookData(book: unknown): Book {
  const bookData = book as any;
  const formattedBook: Book = {
    ...bookData,
    id: bookData.id,
    title: bookData.title,
    author: bookData.author,
    genre: bookData.genre,
    location: bookData.location,
    isAvailable: bookData.isAvailable,
    ownerId: bookData.ownerId,
    ownerName: bookData.ownerName || (bookData.owner ? bookData.owner.name : undefined),
    ownerEmail: bookData.ownerEmail || (bookData.owner ? bookData.owner.email : undefined),
    ownerMobile: bookData.ownerMobile || (bookData.owner ? bookData.owner.mobile : undefined),
    imageUrl: bookData.imageUrl,
    imageKey: bookData.imageKey,
    createdAt: bookData.createdAt,
    updatedAt: bookData.updatedAt
  };
  
  return formattedBook;
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