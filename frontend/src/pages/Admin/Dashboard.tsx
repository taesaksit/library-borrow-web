import React, { useEffect, useState } from "react";
import { BookOpen, Search, Filter, Plus, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useGetAllBook } from "@/services/hooks/useBook";
import { BookModal } from "@/components/modals/BookModal";
import type { TBookRes } from "@/types/book";

export const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<TBookRes[]>([]);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<TBookRes | null>(null);
  const [bookModalMode, setBookModalMode] = useState<"create" | "edit">(
    "create"
  );

  const { data: books = [], isLoading: loading } = useGetAllBook();

  useEffect(() => {
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [books, searchTerm]);

  const getStatusColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage === 0) return "text-red-600 bg-red-50";
    if (percentage < 50) return "text-orange-600 bg-orange-50";
    return "text-green-600 bg-green-50";
  };

  const getStatusText = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage === 0) return "Out of Stock";
    if (percentage < 50) return "Low Stock";
    return "Available";
  };

  const handleAddBook = () => {
    setBookModalMode("create");
    setSelectedBook(null);
    setIsBookModalOpen(true);
  };

  const handleEditBook = (book: TBookRes) => {
    setBookModalMode("edit");
    setSelectedBook(book);
    setIsBookModalOpen(true);
  };

  const handleCloseBookModal = () => {
    setIsBookModalOpen(false);
    setSelectedBook(null);
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading book data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Book List</h1>
              <p className="text-gray-600">
                Manage and view all book information in the system
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            className="hover:cursor-pointer"
            onClick={handleAddBook}
          >
            <Plus className="h-4 w-4" />
            Add New Book
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Books</p>
              <p className="text-2xl font-bold text-gray-900">{books.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Available for Loan
              </p>
              <p className="text-2xl font-bold text-green-600">
                {books.reduce((sum, book) => sum + book.available_quantity, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Currently Borrowed
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {books.reduce(
                  (sum, book) =>
                    sum + (book.quantity - book.available_quantity),
                  0
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-purple-600">
                {new Set(books.map((book) => book.category.name)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Book List</h2>
          <p className="text-sm text-gray-600">
            Showing {filteredBooks.length} items from {books.length} total items
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Book Title</TableHead>
              <TableHead className="font-semibold">Author</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Publication Year</TableHead>
              <TableHead className="font-semibold text-center">
                Total Quantity
              </TableHead>
              <TableHead className="font-semibold text-center">
                Available
              </TableHead>
              <TableHead className="font-semibold text-center">
                Status
              </TableHead>
              <TableHead className="font-semibold text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <BookOpen className="h-12 w-12 text-gray-300" />
                    <p className="text-gray-500">No book data found</p>
                    {searchTerm && (
                      <p className="text-sm text-gray-400">
                        Try changing your search terms
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredBooks.map((book) => (
                <TableRow key={book.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{book.title}</p>
                      <p className="text-sm text-gray-500">ID: {book.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">{book.author}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {book.category.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-700">{book.year}</TableCell>
                  <TableCell className="text-center font-medium">
                    {book.quantity}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {book.available_quantity}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        book.available_quantity,
                        book.quantity
                      )}`}
                    >
                      {getStatusText(book.available_quantity, book.quantity)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3"
                        onClick={() => handleEditBook(book)}
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <BookModal
        isOpen={isBookModalOpen}
        onClose={handleCloseBookModal}
        book={selectedBook}
        mode={bookModalMode}
      />
    </div>
  );
};
