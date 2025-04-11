"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  BookOpen,
  User,
  Mail,
  Phone,
  Trash2,
  Edit,
  Check,
  X,
} from "lucide-react";
import { Book } from "@/hooks/useBooks";
import { User as UserType } from "@/lib/types";
import { EditBookForm } from "@/components/edit-book-form";
import { useDeleteBook, useUpdateBook } from "@/hooks/useBooks";
import { toast } from "@/components/ui/use-toast";
import { BookCover } from "@/components/book-cover";

interface BookListProps {
  books: Book[];
  currentUser: UserType;
  viewMode?: "grid" | "list";
}

export function BookList({
  books,
  currentUser,
  viewMode = "grid",
}: BookListProps) {
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const deleteBook = useDeleteBook();
  const updateBook = useUpdateBook();

  // Process books to ensure they have ownerName
  const processedBooks = books.map((book) => {
    if (book.owner && !book.ownerName) {
      return {
        ...book,
        ownerName: book.owner.name || "Unknown",
        ownerEmail: book.owner.email,
        ownerMobile: book.owner.mobile,
      };
    }
    return {
      ...book,
      ownerName: book.ownerName || "Unknown",
    };
  });

  const handleEdit = (book: Book) => {
    setEditingBook(book);
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
  };

  const handleSaveEdit = () => {
    setEditingBook(null);
  };

  const handleDelete = async (bookId: string) => {
    try {
      await deleteBook.mutateAsync(bookId);
      toast({
        title: "Success",
        description: "Book deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (book: Book) => {
    try {
      await updateBook.mutateAsync({
        id: book.id,
        input: {
          isAvailable: !book.isAvailable,
        },
      });
      toast({
        title: "Success",
        description: `Book marked as ${
          !book.isAvailable ? "available" : "unavailable"
        }!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update book status",
        variant: "destructive",
      });
    }
  };

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {processedBooks.map((book) => (
          <Card key={book.id} className="p-4">
            {editingBook?.id === book.id ? (
              <EditBookForm
                book={book}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            ) : (
              <>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3">
                    <BookCover
                      title={book.title}
                      author={book.author}
                      genre={book.genre || undefined}
                      imageUrl={book.imageUrl || undefined}
                    />
                  </div>
                  <div className="w-full md:w-2/3 space-y-2">
                    <h3 className="text-lg font-semibold">{book.title}</h3>
                    <p className="text-sm text-gray-500">by {book.author}</p>
                    {book.genre && (
                      <Badge variant="secondary">{book.genre}</Badge>
                    )}
                    <p className="text-sm flex items-center">
                      <MapPin className="h-3 w-3 mr-1 inline" /> {book.location}
                    </p>
                    <p className="text-sm flex items-center">
                      <User className="h-3 w-3 mr-1 inline" /> {book.ownerName}
                    </p>
                    <Badge variant={book.isAvailable ? "default" : "secondary"}>
                      {book.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  {currentUser.id === book.ownerId && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(book)}
                      >
                        {book.isAvailable
                          ? "Mark Unavailable"
                          : "Mark Available"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(book)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {processedBooks.map((book) => (
        <Card key={book.id} className="p-4">
          {editingBook?.id === book.id ? (
            <EditBookForm
              book={book}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <>
              <div className="flex items-center">
                <div className="w-20 mr-4">
                  <BookCover
                    title={book.title}
                    author={book.author}
                    genre={book.genre || undefined}
                    imageUrl={book.imageUrl || undefined}
                  />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{book.title}</h3>
                    <p className="text-sm text-gray-500">by {book.author}</p>
                    {book.genre && (
                      <Badge variant="secondary">{book.genre}</Badge>
                    )}
                    <p className="text-sm">
                      <MapPin className="h-3 w-3 mr-1 inline" /> {book.location}
                    </p>
                    <p className="text-sm">
                      <User className="h-3 w-3 mr-1 inline" /> {book.ownerName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={book.isAvailable ? "default" : "secondary"}>
                      {book.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                    {currentUser.id === book.ownerId && (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(book)}
                        >
                          {book.isAvailable
                            ? "Mark Unavailable"
                            : "Mark Available"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(book)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(book.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      ))}
    </div>
  );
}
