import axiosInstance from "./axios-instance";
import type { TypeDataAPI } from "../types/api";

import type { TBookRes, TBookCreate, TBookUpdate } from "@/types/book";

const APIPages = {
  GetAllBook: "/book",
  CreateBook: "/book",
  UpdateBook: "/book",
};

export const fetchGetBookList: () => Promise<
  TypeDataAPI<TBookRes[]>
> = async () => {
  try {
    const { data } = await axiosInstance.get(APIPages.GetAllBook);
    return data ?? { data: [] as TBookRes[] };
  } catch (error) {
    return { data: [] as TBookRes[] };
  }
};

export const fetchCreateBook: (payload: TBookCreate) => Promise<
  TypeDataAPI<TBookRes>
> = async (payload) => {
  try {
    const { data } = await axiosInstance.post(APIPages.CreateBook, payload);
    return data;
  } catch (error) {
    return { data: {} as TBookRes };
  }
};

export const fetchUpdateBook: (payload: TBookUpdate) => Promise<
  TypeDataAPI<TBookRes>
> = async (payload) => {
  try {
    const { data } = await axiosInstance.put(`${APIPages.UpdateBook}/${payload.id}`, {
      title: payload.title,
      author: payload.author,
      year: payload.year,
      quantity: payload.quantity,
      category_id: payload.category_id,
    });
    return data;
  } catch (error) {
    return { data: {} as TBookRes };
  }
};
