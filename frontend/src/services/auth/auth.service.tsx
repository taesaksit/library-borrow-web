import axios from "axios";
import type { TypeDataAPI } from "@/types/api";
import type { TRegisterReq, TRegisterRes } from "@/types/auth/register";
import type { TLoginReq, TLoginRes } from "@/types/auth/login";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const APIPages = {
  PostRegister: "/auth/register",
  PostLogin: "/auth/login",
};

export const fetchPostRegister = async (
  ReqData: TRegisterReq
): Promise<TypeDataAPI<TRegisterRes>> => {
  try {
    const { data } = await axios.post<TypeDataAPI<TRegisterRes>>(
      `${BASE_URL}${APIPages.PostRegister}`,
      ReqData
    );
    return (
      data ?? { data: {} as TRegisterRes, status: "error", message: "No data" }
    );
  } catch (error) {
    return { data: {} as TRegisterRes, status: "error", message: "API Error" };
  }
};

export const fetchPostLogin = async (
  ReqData: TLoginReq
): Promise<TypeDataAPI<TLoginRes>> => {
  try {
    const { data } = await axios.post<TypeDataAPI<TLoginRes>>(
      `${BASE_URL}${APIPages.PostLogin}`,
      ReqData
    );
    return (
      data ?? { data: {} as TLoginRes, status: "error", message: "No data" }
    );
  } catch (error) {
    return { data: {} as TLoginRes, status: "error", message: "API Error" };
  }
};
