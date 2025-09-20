import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { TRegisterReq } from "@/types/auth/register";
import type { TLoginReq } from "@/types/auth/login";
import { fetchPostRegister, fetchPostLogin } from "../auth.service";

import { jwtDecode } from "jwt-decode";

type TDecodedToken = {
  sub: string;
  name: string;
  role: string;
  exp: number;
};

export const handleRegister = async (
  userData: TRegisterReq,
  navigate: (path: string) => void
) => {
  const response = await fetchPostRegister(userData);
  if (response.status === "success") {
    toast.success(`Welcome to the library ${response.data.name}`);
    navigate("/");
  } else {
    toast.error(response.message);
  }
};

export const handleLogin = async (
  userData: TLoginReq,
  navigate: (path: string) => void
) => {
  const response = await fetchPostLogin(userData);
  if (response.status === "success") {
    const token = response.data.access_token;

    // ถอดรหัส JWT เพื่อดึงข้อมูล user
    const decoded: TDecodedToken = jwtDecode(token);
    localStorage.setItem("token", token);
    localStorage.setItem("name", decoded.name);
    localStorage.setItem("role", decoded.role);

    if (decoded.role == "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard")
    }
    toast.success(response.message);
  } else {
    toast.error(response.message);
  }
};
