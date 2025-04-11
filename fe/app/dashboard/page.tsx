"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { BookList } from "@/components/book-list";
import { AddBookForm } from "@/components/add-book-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { BookSearch } from "@/components/book-search";
import type { Book } from "@/hooks/useBooks";
import { BookPlus, BookOpen, Users } from "lucide-react";
import { useUser } from "@/hooks/useAuth";
import {
  useBooks,
  useCreateBook,
  useUpdateBook,
  useDeleteBook,
  SearchParams,
} from "@/hooks/useBooks";
import { Pagination } from "@/components/ui/pagination";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: user, isLoading: isLoadingUser } = useUser();
  const [searchParamsState, setSearchParamsState] = useState<SearchParams>({
    page: 1,
    limit: 10,
    isAvailable: true,
    query: searchParams.get("query") || "",
  });

  const { data: booksData, isLoading: isLoadingBooks } =
    useBooks(searchParamsState);
  const books = booksData?.books || [];
  const pagination = booksData?.pagination;

  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push("/login");
    }
  }, [user, isLoadingUser, router]);

  useEffect(() => {
    // Update search params when URL query changes
    const query = searchParams.get("query");
    if (query !== searchParamsState.query) {
      setSearchParamsState((prev) => ({
        ...prev,
        query: query || "",
        page: 1, // Reset to first page on new search
      }));
    }
  }, [searchParams, searchParamsState.query]);

  const handleSearch = (params: SearchParams) => {
    setSearchParamsState({
      ...params,
      page: 1, // Reset to first page on new search
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParamsState((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleAddBook = async (newBook: Book) => {
    try {
      if (!user) return; // Early return if user is not available

      await createBook.mutateAsync({
        title: newBook.title,
        author: newBook.author,
        genre: newBook.genre,
        location: newBook.location,
        contactInfo: user.email,
      });
      setShowAddForm(false);
      toast({
        title: "Success",
        description: "Book added successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add book",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (bookId: string) => {
    try {
      const book = books.find((b) => b.id === bookId);
      if (!book) return;

      await updateBook.mutateAsync({
        id: bookId,
        input: { isAvailable: !book.isAvailable },
      });

      toast({
        title: "Status Updated",
        description: "Book availability has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update book status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      await deleteBook.mutateAsync(bookId);
      toast({
        title: "Book Removed",
        description: "The book has been removed from your listings",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
    }
  };

  const handleResetSearch = () => {
    setSearchParamsState({
      page: 1,
      limit: 10,
      isAvailable: true,
      query: "",
    });
    // Clear the URL query parameter
    router.push("/dashboard");
  };

  if (isLoadingUser || !user) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const userBooks = books.filter((book) => book.ownerId === user.id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Toaster />

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="browse" className="flex items-center">
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Books
            </TabsTrigger>
            {user.role === "OWNER" && (
              <TabsTrigger value="manage" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Manage My Books
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Search Books</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetSearch}
                className="flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
                Reset Search
              </Button>
            </div>
            <BookSearch
              onSearch={handleSearch}
              initialParams={searchParamsState}
            />

            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Available Books
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({books.length} {books.length === 1 ? "book" : "books"} found)
                </span>
              </h2>

              {isLoadingBooks ? (
                <div className="text-center py-8">Loading books...</div>
              ) : books.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No books found matching your criteria
                </div>
              ) : (
                <>
                  <BookList books={books} currentUser={user} viewMode="grid" />

                  {pagination && pagination.totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                      <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          {user.role === "OWNER" && (
            <TabsContent value="manage" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  My Book Listings
                </h2>
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center"
                >
                  {showAddForm ? (
                    <>Cancel</>
                  ) : (
                    <>
                      <BookPlus className="mr-2 h-4 w-4" />
                      Add New Book
                    </>
                  )}
                </Button>
              </div>

              {showAddForm && (
                <AddBookForm
                  onSuccess={() => {
                    setShowAddForm(false);
                    toast({
                      title: "Success",
                      description: "Book added successfully!",
                    });
                  }}
                />
              )}

              {isLoadingBooks ? (
                <div className="text-center py-8">Loading your books...</div>
              ) : userBooks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  You haven't added any books yet
                </div>
              ) : (
                <BookList
                  books={userBooks}
                  currentUser={user}
                  viewMode="grid"
                />
              )}
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
