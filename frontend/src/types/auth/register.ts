export interface TRegisterReq {
  name: string;
  email: string;
  password: string;
}

export interface TRegisterRes {
  id: number;
  name: string;
  email: string;
  role: "admin" | "borrower";
}
