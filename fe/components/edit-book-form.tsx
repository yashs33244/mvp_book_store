"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book } from "@/hooks/useBooks";
import { useUpdateBook } from "@/hooks/useBooks";
import { toast } from "@/components/ui/use-toast";
import { Image, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useImageUpload } from "@/lib/useImageUpload";
import { useClientOnly } from "@/lib/useClientOnly";
import { isAuthenticated } from "@/lib/api";

interface EditBookFormProps {
  book: Book;
  onSave: () => void;
  onCancel: () => void;
}

export function EditBookForm({ book, onSave, onCancel }: EditBookFormProps) {
  // Wait for client-side rendering
  const isClient = useClientOnly();

  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    genre: book.genre || "",
    location: book.location,
    imageUrl: book.imageUrl || "",
    imageKey: book.imageKey || "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    book.imageUrl || null
  );

  const updateBook = useUpdateBook();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateBook.mutateAsync({
        id: book.id,
        input: formData,
      });

      toast({
        title: "Success",
        description: "Book updated successfully!",
      });

      onSave();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update book. Please ensure you're logged in.",
        variant: "destructive",
      });
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
      imageKey: "",
    }));
  };

  // Check authentication on component mount
  useEffect(() => {
    // Only run on client-side
    if (isClient && !isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to edit books.",
        variant: "destructive",
      });
    }
  }, [isClient]);

  // Don't render until client-side is ready
  if (!isClient) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="genre">Genre</Label>
        <Select value={formData.genre} onValueChange={handleGenreChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="fiction">Fiction</SelectItem>
            <SelectItem value="non-fiction">Non-Fiction</SelectItem>
            <SelectItem value="science-fiction">Science Fiction</SelectItem>
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
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
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
                    Drag & drop a book cover image here, or click to select one
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

      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={updateBook.isPending || isUploading}>
          {updateBook.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
