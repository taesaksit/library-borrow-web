import React, { useState } from "react";
import { useGetCurrentBorrow, useReturnBook } from "@/services/hooks/useBorrow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  BookOpen,
  RotateCcw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import ReturnModal from "@/components/modals/ReturnModal";

const MyBorrows: React.FC = () => {
  const { data: borrows, isLoading, error } = useGetCurrentBorrow();
  const returnBookMutation = useReturnBook();
  const [selectedBorrow, setSelectedBorrow] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReturnClick = (borrowId: string, bookTitle: string) => {
    setSelectedBorrow({ id: borrowId, title: bookTitle });
    setIsModalOpen(true);
  };

  const handleReturnConfirm = () => {
    if (selectedBorrow) {
      returnBookMutation.mutate({ borrow_id: selectedBorrow.id });
      setIsModalOpen(false);
      setSelectedBorrow(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBorrow(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "borrowed":
        return (
          <Badge variant="default" className="ml-2">
            Borrowed
          </Badge>
        );
      case "waiting_approve":
        return (
          <Badge variant="secondary" className="ml-2">
            Waiting Approval
          </Badge>
        );
      case "returned":
        return (
          <Badge variant="outline" className="ml-2">
            Returned
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="ml-2">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading your borrows...</span>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Borrowed Books
        </h1>
        <p className="text-gray-600">
          Total borrowed books:{" "}
          <span className="font-semibold">{borrows?.length || 0}</span>
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            My Borrow List
          </h2>
          <p className="text-sm text-gray-600">
            Showing {borrows?.length || 0} borrowed books
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Book Title</TableHead>
              <TableHead className="font-semibold">Borrow Date</TableHead>
              <TableHead className="font-semibold">Due Date</TableHead>
              <TableHead className="font-semibold">Return Date</TableHead>
              <TableHead className="font-semibold text-center">
                Status
              </TableHead>
              <TableHead className="font-semibold text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {borrows?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <BookOpen className="h-12 w-12 text-gray-300" />
                    <p className="text-gray-500">No borrowed books</p>
                    <p className="text-sm text-gray-400">
                      You haven't borrowed any books yet.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              borrows?.map((borrow) => (
                <TableRow key={borrow.borrow_id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{borrow.book}</p>
                      <p className="text-xs text-gray-500">
                        ID: {borrow.borrow_id}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {formatDate(borrow.borrow_date)}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {formatDate(borrow.due_date)}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {borrow.return_date ? formatDate(borrow.return_date) : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(borrow.status)}
                  </TableCell>
                  <TableCell className="text-center">
                    {borrow.status === "borrowed" && (
                      <Button
                        onClick={() =>
                          handleReturnClick(borrow.borrow_id, borrow.book)
                        }
                        disabled={returnBookMutation.isPending}
                        variant="outline"
                        size="sm"
                        className="h-8 px-4 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800 transition-colors duration-200"
                      >
                        {returnBookMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Returning...
                          </>
                        ) : (
                          <>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Return Book
                          </>
                        )}
                      </Button>
                    )}
                    {borrow.status === "waiting_approve" && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Waiting Approval
                        </span>
                      </div>
                    )}
                    {borrow.status === "returned" && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-md text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Returned
                        </span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ReturnModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleReturnConfirm}
        bookTitle={selectedBorrow?.title || ""}
        borrowId={selectedBorrow?.id || ""}
        isLoading={returnBookMutation.isPending}
      />
    </div>
  );
};

export default MyBorrows;
