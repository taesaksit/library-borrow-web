// 1. Third-party libraries
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// 2. Custom hooks
import useToast from "./useToast";

// 4. Type
import type { TypeDataAPI } from "../../types/api";
import type { TCategoryRes } from "@/types/category";

// 5. API functions
import {
  fetchGetCategoryList,
  fetchCreateCategory,
  fetchUpdateCategory,
} from "../category.service";

// 6. Constants
import { querykey } from "@/constants/query-key";

export const useGetAllCategory = () => {
  const navigate = useNavigate();
  return useQuery<TCategoryRes[], Error>({
    queryKey: [querykey.GET_ALL_CATEGORY],
    queryFn: async () => {
      const response = await fetchGetCategoryList();
      if (response.status === "success") {
        return response.data;
      } else {
        navigate("/");
      }
      throw new Error(response.message || "Failed to fetch category list");
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { setToastAlert } = useToast();

  return useMutation({
    mutationFn: fetchCreateCategory,
    onSuccess: (response) => {
      if (response.status === "success") {
        setToastAlert({
          type: "success",
          message: "Category added successfully",
        });
        queryClient.invalidateQueries({
          queryKey: [querykey.GET_ALL_CATEGORY],
        });
      } else {
        setToastAlert({
          type: "error",
          message: response.message || "Error occurred while adding category",
        });
      }
    },
    onError: (error) => {
      setToastAlert({
        type: "error",
        message: "Error occurred while adding category",
      });
      console.error("Create category error:", error);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { setToastAlert } = useToast();

  return useMutation({
    mutationFn: fetchUpdateCategory,
    onSuccess: (response) => {
      if (response.status === "success") {
        setToastAlert({
          type: "success",
          message: "Category updated successfully",
        });
        queryClient.invalidateQueries({
          queryKey: [querykey.GET_ALL_CATEGORY],
        });
      } else {
        setToastAlert({
          type: "error",
          message: response.message || "Error occurred while updating category",
        });
      }
    },
    onError: (error) => {
      setToastAlert({
        type: "error",
        message: "Error occurred while updating category",
      });
      console.error("Update category error:", error);
    },
  });
};
