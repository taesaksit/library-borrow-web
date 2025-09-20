import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
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

import {
  useGetActiveBorrow,
  useApproveReturn,
} from "@/services/hooks/useBorrow";
import type { TActiveBorrowResponse } from "@/types/borrow";

export const ManageBorrow = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBorrows, setFilteredBorrows] = useState<
    TActiveBorrowResponse[]
  >([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const { data: activeBorrows = [], isLoading: loading } = useGetActiveBorrow();
  const approveReturnMutation = useApproveReturn();

  useEffect(() => {
    let filtered = activeBorrows.filter(
      (borrow) =>
        borrow.book.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrow.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        borrow.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((borrow) => borrow.status === selectedStatus);
    }

    setFilteredBorrows(filtered);
  }, [activeBorrows, searchTerm, selectedStatus]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "borrowed":
        return "text-blue-600 bg-blue-50";
      case "returned":
        return "text-green-600 bg-green-50";
      case "waiting_approve":
        return "text-yellow-600 bg-yellow-50";
      case "overdue":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "borrowed":
        return <Clock className="h-4 w-4" />;
      case "returned":
        return <CheckCircle className="h-4 w-4" />;
      case "waiting_approve":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleApproveReturn = (borrowId: string) => {
    approveReturnMutation.mutate(borrowId);
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading borrow data...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">
                Manage Borrows
              </h1>
              <p className="text-gray-600">
                Approve and manage book return requests
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search borrows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="borrowed">Borrowed</option>
            <option value="waiting_approve">Waiting Approval</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Borrows</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeBorrows.length}
              </p>
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
                Currently Borrowed
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {
                  activeBorrows.filter((borrow) => borrow.status === "borrowed")
                    .length
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Waiting Approval
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {
                  activeBorrows.filter((borrow) => borrow.status === "waiting_approve")
                    .length
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Returned</p>
              <p className="text-2xl font-bold text-green-600">
                {
                  activeBorrows.filter((borrow) => borrow.status === "returned")
                    .length
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                {
                  activeBorrows.filter((borrow) => borrow.status === "overdue")
                    .length
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Borrow List
          </h2>
          <p className="text-sm text-gray-600">
            Showing {filteredBorrows.length} items from {activeBorrows.length}{" "}
            total items
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Book</TableHead>
              <TableHead className="font-semibold">User</TableHead>
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
            {filteredBorrows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <BookOpen className="h-12 w-12 text-gray-300" />
                    <p className="text-gray-500">No borrow data found</p>
                    {searchTerm && (
                      <p className="text-sm text-gray-400">
                        Try changing your search terms
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredBorrows.map((borrow) => (
                <TableRow key={borrow.borrow_id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{borrow.book}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">{borrow.user}</TableCell>
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
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        borrow.status
                      )}`}
                    >
                      {getStatusIcon(borrow.status)}
                      <span className="ml-1">{borrow.status}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      {borrow.status === "waiting_approve" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleApproveReturn(borrow.borrow_id)}
                            disabled={approveReturnMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {approveReturnMutation.isPending
                              ? "Approving..."
                              : "Approve Return"}
                          </Button>
                        </>
                      )}
                      {borrow.status === "borrowed" && (
                        <span className="text-blue-600 text-sm font-medium">
                          Active
                        </span>
                      )}
                      {borrow.status === "returned" && (
                        <span className="text-green-600 text-sm font-medium">
                          Returned
                        </span>
                      )}
                      {borrow.status === "overdue" && (
                        <span className="text-red-600 text-sm font-medium">
                          Overdue
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
