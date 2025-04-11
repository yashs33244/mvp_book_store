import { useState, useCallback } from 'react';
import { api } from './api';
import { toast } from '@/components/ui/use-toast';
import { isAuthenticated } from './api';
import axios from 'axios';

interface UseImageUploadOptions {
  onUploadSuccess?: (imageUrl: string, imageKey: string) => void;
  onUploadError?: (error: any) => void;
}

interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<{ imageUrl: string; imageKey: string } | null>;
  isUploading: boolean;
  resetUpload: () => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = useCallback(async (file: File) => {
    if (!file) return null;

    // Check authentication first
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload images",
        variant: "destructive"
      });
      
      if (options.onUploadError) {
        options.onUploadError(new Error("Authentication required"));
      }
      
      return null;
    }

    setIsUploading(true);
    try {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }
      
      // Max size 5MB
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit');
      }

      // Get a pre-signed URL from our API
      const { data } = await api.post('/api/books/upload-url', {
        fileType: file.type
      });

      if (!data || !data.uploadUrl || !data.key) {
        throw new Error('Invalid response from server');
      }

      console.log('Uploading to presigned URL:', data.uploadUrl);
      
      // Use vanilla axios for S3 upload instead of api instance
      // This avoids adding auth headers that might interfere with the presigned URL
      const uploadResponse = await axios.put(data.uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
          // Don't add extra headers that might invalidate the signature
        },
        // IMPORTANT: Disable automatic transforms that might modify the binary data
        transformRequest: [(data) => data],
        // Add timeout to prevent hanging requests
        timeout: 30000
      });
      
      console.log('Upload response status:', uploadResponse.status);

      // Create image URL by removing query params from the presigned URL
      const imageUrl = data.uploadUrl.split('?')[0];
      
      // Call success callback if provided
      if (options.onUploadSuccess) {
        options.onUploadSuccess(imageUrl, data.key);
      }
      
      toast({
        title: "Success",
        description: "Image uploaded successfully!"
      });
      
      return { imageUrl, imageKey: data.key };
    } catch (error: any) {
      console.error('Upload error:', error);
      
      // Extract meaningful error message
      let errorMessage = "Failed to upload image. Please try again.";
      let errorTitle = "Error";
      
      if (error.response) {
        console.error('Error response:', error.response.status, error.response.data);
        
        // Server responded with an error
        if (error.response.status === 401) {
          errorMessage = "Authentication required. Please log in again.";
        } else if (error.response.status === 403) {
          errorMessage = "You don't have permission to upload images.";
        } else if (error.response.status === 400) {
          errorMessage = "Invalid file or request format. Please try a different image.";
        } else if (error.response.status === 500) {
          // Check for S3 configuration error
          if (error.response.data?.message?.includes('S3 service not')) {
            errorTitle = "Server Configuration Error";
            errorMessage = "The image upload service is not properly configured. Please contact the administrator.";
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        // Client-side error
        errorMessage = error.message;
      }
      
      // Call error callback if provided
      if (options.onUploadError) {
        options.onUploadError(error);
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [options]);

  const resetUpload = useCallback(() => {
    setIsUploading(false);
  }, []);

  return {
    uploadImage,
    isUploading,
    resetUpload
  };
} 