import React, { useState, useMemo } from "react";
import { useGetAllBook } from "@/services/hooks/useBook";
import { useBorrowBook } from "@/services/hooks/useBorrow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, BookOpen, User, Calendar, Hash, Search, X } from "lucide-react";
import BorrowModal from "@/components/modals/BorrowModal";

const BookList: React.FC = () => {
  const { data: books, isLoading, error } = useGetAllBook();
  const borrowBookMutation = useBorrowBook();
  const [selectedBook, setSelectedBook] = useState<{ id: number; title: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter books based on search query
  const filteredBooks = useMemo(() => {
    if (!books || !searchQuery.trim()) return books;
    
    const query = searchQuery.toLowerCase().trim();
    return books.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.category.name.toLowerCase().includes(query)
    );
  }, [books, searchQuery]);

  const handleBorrowClick = (bookId: number, bookTitle: string) => {
    setSelectedBook({ id: bookId, title: bookTitle });
    setIsModalOpen(true);
  };

  const handleBorrowConfirm = (dueDate: string) => {
    if (selectedBook) {
      borrowBookMutation.mutate({ 
        book_id: selectedBook.id,
        due_date: dueDate 
      });
      setIsModalOpen(false);
      setSelectedBook(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading books...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Library Books</h1>
        <p className="text-gray-600 mb-4">
          Total books available: <span className="font-semibold">{books?.length || 0}</span>
          {searchQuery && (
            <span className="ml-2">
              • Showing <span className="font-semibold">{filteredBooks?.length || 0}</span> results
            </span>
          )}
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search books by title, author, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks?.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {book.title}
                </h3>
                <Badge 
                  className={`ml-2 ${
                    book.available_quantity > 0
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}
                >
                  {book.available_quantity > 0 ? "Available" : "Unavailable"}
                </Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{book.author}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{book.year}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Hash className="h-4 w-4" />
                  <span>{book.category.name}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Total:</span>{" "}
                  <span className="text-gray-600">{book.quantity}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Available:</span>{" "}
                  <span className={`font-semibold ${
                    book.available_quantity > 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {book.available_quantity}
                  </span>
                </div>
              </div>
              
              <Button
                onClick={() => handleBorrowClick(book.id, book.title)}
                disabled={book.available_quantity === 0 || borrowBookMutation.isPending}
                className={`w-full transition-all duration-200 ${
                  book.available_quantity > 0
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                variant={book.available_quantity > 0 ? "default" : "secondary"}
              >
                {borrowBookMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Borrowing...
                  </>
                ) : (
                  <>
                    <BookOpen className="mr-2 h-4 w-4" />
                    {book.available_quantity > 0 ? "Borrow Book" : "Not Available"}
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks?.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "No books found" : "No books available"}
          </h3>
          <p className="text-gray-600">
            {searchQuery 
              ? `No books match your search for "${searchQuery}". Try different keywords.`
              : "There are no books in the library at the moment."
            }
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={clearSearch}
              className="mt-4"
            >
              Clear Search
            </Button>
          )}
        </div>
      )}

      <BorrowModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleBorrowConfirm}
        bookTitle={selectedBook?.title || ""}
        isLoading={borrowBookMutation.isPending}
      />
    </div>
  );
};

export default BookList; 