"use client";

import type React from "react";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookPlus,
  Tag,
  MapPin,
  FileText,
  User,
  Mail,
  Upload,
  X,
  Image,
} from "lucide-react";
import type { Book } from "@/lib/types";
import { useCreateBook } from "@/hooks/useBooks";
import { toast } from "@/components/ui/use-toast";
import { useDropzone } from "react-dropzone";
import { useImageUpload } from "@/lib/useImageUpload";
import { useClientOnly } from "@/lib/useClientOnly";
import { isAuthenticated } from "@/lib/api";

interface AddBookFormProps {
  onSuccess?: () => void;
}

export function AddBookForm({ onSuccess }: AddBookFormProps) {
  // Wait for client-side rendering
  const isClient = useClientOnly();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    location: "",
    contactInfo: "",
    imageUrl: "",
    imageKey: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const createBook = useCreateBook();

  // Use our custom image upload hook
  const { uploadImage, isUploading, resetUpload } = useImageUpload({
    onUploadSuccess: (imageUrl, imageKey) => {
      setFormData((prev) => ({
        ...prev,
        imageUrl,
        imageKey,
      }));
    },
  });

  // Handle file drop
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        // Upload the image using our custom hook
        await uploadImage(file);

        // Set preview image
        setImagePreview(URL.createObjectURL(file));
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    },
    [uploadImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBook.mutateAsync(formData);
      toast({
        title: "Success",
        description: "Book added successfully!",
      });
      setFormData({
        title: "",
        author: "",
        genre: "",
        location: "",
        contactInfo: "",
        imageUrl: "",
        imageKey: "",
      });
      setImagePreview(null);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add book. Please ensure you're logged in.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenreChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      genre: value,
    }));
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
      imageKey: "",
    }));
  };

  // Client-side only
  useEffect(() => {
    // Only run on client-side
    if (isClient && !isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add books.",
        variant: "destructive",
      });
    }
  }, [isClient]);

  // Don't render until client-side is ready
  if (!isClient) {
    return null;
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3 bg-primary/5">
        <CardTitle className="text-xl flex items-center">
          <BookPlus className="mr-2 h-5 w-5 text-primary" />
          Add New Book
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Book Title *
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author" className="text-sm font-medium">
                Author *
              </Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-sm font-medium">
                Genre
              </Label>
              <Select value={formData.genre} onValueChange={handleGenreChange}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select genre" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fiction">Fiction</SelectItem>
                  <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                  <SelectItem value="science-fiction">
                    Science Fiction
                  </SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="mystery">Mystery</SelectItem>
                  <SelectItem value="romance">Romance</SelectItem>
                  <SelectItem value="biography">Biography</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="self-help">Self-Help</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Location *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  name="location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={handleChange}
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactInfo" className="text-sm font-medium">
              Contact Information *
            </Label>
            <Input
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="Phone number or email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Book Cover Image</Label>
            {imagePreview ? (
              <div className="relative w-40 h-60 border border-gray-200 rounded-md overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Book cover preview"
                  className="object-cover w-full h-full"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 w-6 h-6 rounded-full"
                  onClick={removeImage}
                  type="button"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors
                  ${
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 hover:border-primary/50"
                  }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2">
                  <Image className="h-8 w-8 text-gray-400" />
                  {isUploading ? (
                    <p>Uploading...</p>
                  ) : isDragActive ? (
                    <p>Drop the image here ...</p>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-500">
                        Drag & drop a book cover image here, or click to select
                        one
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Supports: JPG, PNG, GIF
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="flex items-center"
              disabled={isUploading || createBook.isPending}
            >
              <BookPlus className="mr-2 h-4 w-4" />
              {createBook.isPending ? "Adding..." : "Add Book"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
