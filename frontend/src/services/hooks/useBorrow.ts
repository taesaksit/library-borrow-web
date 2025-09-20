// 1. Third-party libraries
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// 2. Custom hooks
import useToast from "./useToast";

// 4. Type
import type { TypeDataAPI } from "../../types/api";
import type {
  TActiveBorrowResponse,
  TReturnBorrowResponse,
  TBorrowBookRequest,
  TBorrowBookResponse,
  TReturnBookRequest,
  TReturnBookResponse,
} from "@/types/borrow";

// 5. API functions
import {
  fetchGetActiveBorrowList,
  fetchPutApproveReturn,
  fetchBorrowBook,
  fetchReturnBook,
  fetchGetCurrentBorrow,
} from "../borrow.service";

// 6. Constants
import { querykey } from "@/constants/query-key";

export const useGetActiveBorrow = () => {
  const navigate = useNavigate();
  return useQuery<TActiveBorrowResponse[], Error>({
    queryKey: [querykey.GET_ACTIVE_BORROW],
    queryFn: async () => {
      const response = await fetchGetActiveBorrowList();
      if (response.status === "success") {
        return response.data;
      } else {
        navigate("/");
      }
      throw new Error(response.message || "Failed to fetch active borrow list");
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
};

export const useGetCurrentBorrow = () => {
  const navigate = useNavigate();
  return useQuery<TActiveBorrowResponse[], Error>({
    queryKey: [querykey.GET_CURRENT_BORROW],
    queryFn: async () => {
      const response = await fetchGetCurrentBorrow();
      if (response.status === "success") {
        return response.data;
      } else {
        navigate("/");
      }
      throw new Error(response.message || "Failed to fetch active borrow list");
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
};

export const useApproveReturn = () => {
  const queryClient = useQueryClient();
  const { setToastAlert } = useToast();


  return useMutation<TypeDataAPI<TReturnBorrowResponse>, Error, string>({
    mutationFn: fetchPutApproveReturn,
    onSuccess: (response) => {
      if (response.status === "success") {
        setToastAlert({
          type: "success",
          message: "Return approved successfully",
        });
        queryClient.invalidateQueries({
          queryKey: [querykey.GET_ACTIVE_BORROW],
        });
      } else {
        setToastAlert({
          type: "error",
          message: response.message || "Error occurred while approving return",
        });
      }
    },
    onError: (error) => {
      setToastAlert({
        type: "error",
        message: "Error occurred while approving return",
      });
      console.error("Approve return error:", error);
    },
  });
};

export const useBorrowBook = () => {
  const queryClient = useQueryClient();
  const { setToastAlert } = useToast();


  return useMutation<
    TypeDataAPI<TBorrowBookResponse>,
    Error,
    TBorrowBookRequest
  >({
    mutationFn: fetchBorrowBook,
    onSuccess: (response) => {
      if (response.status === "success") {
        setToastAlert({
          type: "success",
          message: "Book borrowed successfully",
        });
        queryClient.invalidateQueries({
          queryKey: [querykey.GET_ALL_BOOK],
        });
      } else {
        setToastAlert({
          type: "error",
          message: response.message || "Error occurred while borrowing book",
        });
      }
    },
    onError: (error: any) => {
      setToastAlert({
        type: "error",
        message: "Error occurred while borrowing book",
      });
      console.error("Borrow book error:", error);
    },
  });
};

export const useReturnBook = () => {
  const queryClient = useQueryClient();
  const { setToastAlert } = useToast();
  

  return useMutation<
    TypeDataAPI<TReturnBookResponse>,
    Error,
    TReturnBookRequest
  >({
    mutationFn: fetchReturnBook,
    onSuccess: (response) => {
      if (response.status === "success") {
        setToastAlert({
          type: "success",
          message:
            "Return request submitted successfully. Waiting for admin approval.",
        });
        queryClient.invalidateQueries({
          queryKey: [querykey.GET_CURRENT_BORROW],
        });
      } else {
        setToastAlert({
          type: "error",
          message:
            response.message ||
            "Error occurred while submitting return request",
        });
      }
    },
    onError: (error: any) => {
      setToastAlert({
        type: "error",
        message: "Error occurred while submitting return request",
      });
      console.error("Return book error:", error);
    },
  });
};
