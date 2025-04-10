"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookPlus, Tag, MapPin, FileText, User, Mail } from "lucide-react"
import type { Book } from "@/lib/types"

interface AddBookFormProps {
  onAddBook: (book: Book) => void
  ownerId: string
  ownerName: string
  ownerContact: string
}

export function AddBookForm({ onAddBook, ownerId, ownerName, ownerContact }: AddBookFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    location: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGenreChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      genre: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newBook: Book = {
      id: Date.now().toString(),
      title: formData.title,
      author: formData.author,
      genre: formData.genre,
      location: formData.location,
      description: formData.description,
      ownerId,
      ownerName,
      ownerContact,
      isAvailable: true,
      createdAt: new Date().toISOString(),
    }

    onAddBook(newBook)

    // Reset form
    setFormData({
      title: "",
      author: "",
      genre: "",
      location: "",
      description: "",
    })
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
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author" className="text-sm font-medium">
                Author *
              </Label>
              <Input id="author" name="author" value={formData.author} onChange={handleChange} required />
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
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <div className="relative">
              <FileText className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the book, its condition, etc."
                value={formData.description}
                onChange={handleChange}
                className="pl-9 min-h-[100px]"
                rows={3}
              />
            </div>
          </div>

          <div className="bg-muted/30 p-3 rounded-md border border-border">
            <h4 className="text-sm font-medium mb-2">Owner Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-sm">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{ownerName}</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{ownerContact}</span>
              </div>
            </div>
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
  )
}
