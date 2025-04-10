"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Book, User } from "@/lib/types"
import { BookOpen, MapPin, Mail, Trash2, Phone, Calendar, Tag, Info } from "lucide-react"
import { BookCover } from "@/components/book-cover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface BookListProps {
  books: Book[]
  currentUser: User
  onToggleStatus: (bookId: string) => void
  onDeleteBook: (bookId: string) => void
  viewMode: "browse" | "manage"
}

export function BookList({ books, currentUser, onToggleStatus, onDeleteBook, viewMode }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-950 rounded-lg border border-border">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-serif">No books found</h3>
        <p className="mt-2 text-sm text-muted-foreground font-sans">
          {viewMode === "manage"
            ? "You haven't added any books yet."
            : "There are no books available matching your criteria."}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <Card
          key={book.id}
          className="overflow-hidden border-2 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
        >
          <CardHeader className="pb-3 bg-gray-50 dark:bg-gray-950">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl line-clamp-1 font-serif">{book.title}</CardTitle>
                <CardDescription className="line-clamp-1 font-sans">by {book.author}</CardDescription>
              </div>
              <Badge variant={book.isAvailable ? "default" : "secondary"} className="ml-2 flex-shrink-0 font-body">
                {book.isAvailable ? "Available" : "Not Available"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-3 pt-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <BookCover title={book.title} author={book.author} genre={book.genre} />
              </div>
              <div className="col-span-3 space-y-3">
                {book.genre && (
                  <div className="flex items-center text-sm font-sans">
                    <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{book.genre}</span>
                  </div>
                )}
                <div className="flex items-center text-sm font-sans">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{book.location}</span>
                </div>
                <div className="flex items-center text-sm font-sans">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Added {new Date(book.createdAt).toLocaleDateString()}</span>
                </div>
                {book.description && (
                  <div className="pt-2">
                    <p className="text-sm line-clamp-2 font-sans">{book.description}</p>
                  </div>
                )}
                <div className="pt-2 border-t mt-3">
                  <h4 className="text-sm font-serif mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-1 text-muted-foreground" />
                    Owner Details:
                  </h4>
                  <p className="text-sm font-medium font-sans">{book.ownerName}</p>
                  <div className="flex items-center text-sm mt-1 font-sans">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{book.ownerContact}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2 border-t bg-gray-50 dark:bg-gray-950">
            {viewMode === "manage" && book.ownerId === currentUser.id ? (
              <>
                <Button variant="outline" size="sm" className="font-body">
                  Mark as {book.isAvailable ? "Unavailable" : "Available"}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-serif">Delete Book</DialogTitle>
                      <DialogDescription className="font-sans">
                        Are you sure you want to delete "{book.title}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {}} className="font-body">
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={() => onDeleteBook(book.id)} className="font-body">
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="w-full bg-black text-white dark:bg-white dark:text-black font-body"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact Owner
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
