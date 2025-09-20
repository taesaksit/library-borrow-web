import axiosInstance from "./axios-instance";
import type { TypeDataAPI } from "../types/api";
import type {
  TActiveBorrowResponse,
  TReturnBorrowResponse,
  TBorrowBookRequest,
  TBorrowBookResponse,
  TReturnBookRequest,
  TReturnBookResponse,
} from "@/types/borrow";


const APIPages = {
  GetActiveBorrow: "/borrow/all_borrowed",
  GetCurrentBorrow: "/borrow/current_borrow",
  ApproveReturn: "/borrow/approve_return",
  BorrowBook: "/borrow",
  ReturnBook: "/borrow/return",
};

export const fetchGetActiveBorrowList: () => Promise<
  TypeDataAPI<TActiveBorrowResponse[]>
> = async () => {
  try {
    const { data } = await axiosInstance.get(APIPages.GetActiveBorrow);
    return data ?? { data: [] as TActiveBorrowResponse[] };
  } catch (error) {
    return { data: [] as TActiveBorrowResponse[] };
  }
};

export const fetchGetCurrentBorrow: () => Promise<
  TypeDataAPI<TActiveBorrowResponse[]>
> = async () => {
  try {
    const { data } = await axiosInstance.get(APIPages.GetCurrentBorrow);
    return data ?? { data: [] as TActiveBorrowResponse[] };
  } catch (error) {
    return { data: [] as TActiveBorrowResponse[] };
  }
};

export const fetchPutApproveReturn: (
  borrow_id: string
) => Promise<TypeDataAPI<TReturnBorrowResponse>> = async (borrow_id) => {
  try {
    const { data } = await axiosInstance.put(
      `${APIPages.ApproveReturn}/${borrow_id}`
    );
    return data ?? { data: {} as TReturnBorrowResponse };
  } catch (error) {
    return { data: {} as TReturnBorrowResponse };
  }
};

export const fetchBorrowBook: (
  borrowData: TBorrowBookRequest
) => Promise<TypeDataAPI<TBorrowBookResponse>> = async (borrowData) => {
  try {
    const { data } = await axiosInstance.post(APIPages.BorrowBook, borrowData);
    return data ?? { data: {} as TBorrowBookResponse };
  } catch (error) {
    return { data: {} as TBorrowBookResponse };
  }
};

export const fetchReturnBook: (
  returnData: TReturnBookRequest
) => Promise<TypeDataAPI<TReturnBookResponse>> = async (returnData) => {
  try {
    const { data } = await axiosInstance.put(
      `${APIPages.ReturnBook}/${returnData.borrow_id}`
    );
    return data ?? { data: {} as TReturnBookResponse };
  } catch (error) {
    return { data: {} as TReturnBookResponse };
  }
};
