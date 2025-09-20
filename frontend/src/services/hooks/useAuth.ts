import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  role: string;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || !role) {
        setUser({ role: "", isAuthenticated: false });
        setLoading(false);
        return;
      }

      try {
        const decodedToken: { exp?: number } = jwtDecode(token);
        if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
          localStorage.clear();
          setUser({ role: "", isAuthenticated: false });
          setLoading(false);
          return;
        }

        setUser({ role, isAuthenticated: true });
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.clear();
        setUser({ role: "", isAuthenticated: false });
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const isAdmin = user?.role === "admin";
  const isBorrower = user?.role === "borrower";
  const isAuthenticated = user?.isAuthenticated;

  return {
    user,
    loading,
    isAdmin,
    isBorrower,
    isAuthenticated,
  };
}; 