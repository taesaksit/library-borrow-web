import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  exp?: number;
  [key: string]: any;
}

export const checkTokenValidity = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};

export const getUserRole = (): string | null => {
  return localStorage.getItem("role");
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  
  if (!token || !role) {
    return false;
  }
  
  return checkTokenValidity(token);
};

export const isAdmin = (): boolean => {
  const role = getUserRole();
  return role === "admin";
};

export const isBorrower = (): boolean => {
  const role = getUserRole();
  return role === "borrower";
};

export const hasPermission = (requiredRole: "admin" | "borrower" | "any"): boolean => {
  if (!isAuthenticated()) {
    return false;
  }
  
  if (requiredRole === "any") {
    return true;
  }
  
  const role = getUserRole();
  return role === requiredRole;
};

export const clearAuthData = (): void => {
  localStorage.clear();
}; 