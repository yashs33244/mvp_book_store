"use client";

import type React from "react";

import { useState } from "react";
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
import { BookPlus, Tag, MapPin, FileText, User, Mail } from "lucide-react";
import type { Book } from "@/lib/types";
import { useCreateBook } from "@/hooks/useBooks";
import { toast } from "@/components/ui/use-toast";

interface AddBookFormProps {
  onSuccess?: () => void;
}

export function AddBookForm({ onSuccess }: AddBookFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    location: "",
    contactInfo: "",
  });

  const createBook = useCreateBook();

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
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add book. Please try again.",
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

          <div className="flex justify-end">
            <Button type="submit" className="flex items-center">
              <BookPlus className="mr-2 h-4 w-4" />
              Add Book
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
