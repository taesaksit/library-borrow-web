// 1. Third-party libraries
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// 2. Custom hooks
import useToast from "./useToast";

// 4. Type
import type { TypeDataAPI } from "../../types/api";
import type { TBookRes, TBookCreate, TBookUpdate } from "@/types/book";

// 5. API functions
import {
  fetchGetBookList,
  fetchCreateBook,
  fetchUpdateBook,
} from "../book.service";

// 6. Constants
import { querykey } from "@/constants/query-key";

export const useGetAllBook = () => {
  const navigate = useNavigate();
  return useQuery<TBookRes[], Error>({
    queryKey: [querykey.GET_ALL_BOOK],
    queryFn: async () => {
      const response = await fetchGetBookList();
      if (response.status === "success") {
        return response.data;
      } else {
        navigate("/");
      }
      throw new Error(response.message || "Failed to fetch book list");
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  const { setToastAlert } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: fetchCreateBook,
    onSuccess: (response) => {
      if (response.status === "success") {
        setToastAlert({ type: "success", message: "Book added successfully" });
        queryClient.invalidateQueries({ queryKey: [querykey.GET_ALL_BOOK] });
      } else {
        // Check if it's an access denied error
        if (response.message === "Access denied") {
          localStorage.clear();
          navigate("/");
          return;
        }
        setToastAlert({
          type: "error",
          message: response.message || "Error occurred while adding book",
        });
      }
    },
    onError: (error: any) => {
      // Handle axios error with access denied message
      if (error.response?.data?.message === "Access denied") {
        localStorage.clear();
        navigate("/");
        return;
      }
      setToastAlert({
        type: "error",
        message: "Error occurred while adding book",
      });
      console.error("Create book error:", error);
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  const { setToastAlert } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: fetchUpdateBook,
    onSuccess: (response) => {
      if (response.status === "success") {
        setToastAlert({
          type: "success",
          message: "Book updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: [querykey.GET_ALL_BOOK] });
      } else {
        // Check if it's an access denied error
        if (response.message === "Access denied") {
          localStorage.clear();
          navigate("/");
          return;
        }
        setToastAlert({
          type: "error",
          message: response.message || "Error occurred while updating book",
        });
      }
    },
    onError: (error: any) => {
      // Handle axios error with access denied message
      if (error.response?.data?.message === "Access denied") {
        localStorage.clear();
        navigate("/");
        return;
      }
      setToastAlert({
        type: "error",
        message: "Error occurred while updating book",
      });
      console.error("Update book error:", error);
    },
  });
};
