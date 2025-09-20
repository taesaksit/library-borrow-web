import axiosInstance from "./axios-instance";
import type { TypeDataAPI } from "../types/api";

import type { TCategoryRes } from "@/types/category";

const APIPages = {
  GetAllCategory: "/category",
  CreateCategory: "/category",
  UpdateCategory: "/category",
};

export const fetchGetCategoryList: () => Promise<
  TypeDataAPI<TCategoryRes[]>
> = async () => {
  try {
    const { data } = await axiosInstance.get(APIPages.GetAllCategory);
    return data ?? { data: [] as TCategoryRes[] };
  } catch (error) {
    return { data: [] as TCategoryRes[] };
  }
};

export const fetchCreateCategory: (payload: { name: string }) => Promise<
  TypeDataAPI<TCategoryRes>
> = async (payload) => {
  try {
    const { data } = await axiosInstance.post(APIPages.CreateCategory, payload);
    return data;
  } catch (error) {
    return { data: {} as TCategoryRes, status: "error", message: "Failed to create category" };
  }
};

export const fetchUpdateCategory: (payload: { id: number; name: string }) => Promise<
  TypeDataAPI<TCategoryRes>
> = async (payload) => {
  try {
    const { data } = await axiosInstance.put(`${APIPages.UpdateCategory}/${payload.id}`, {
      name: payload.name,
    });
    return data;
  } catch (error) {
    return { data: {} as TCategoryRes, status: "error", message: "Failed to update category" };
  }
};
