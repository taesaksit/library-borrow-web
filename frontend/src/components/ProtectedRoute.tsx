import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      // ถ้าไม่มี token หรือ role ให้ redirect ไป login
      if (!token || !role) {
        navigate("/");
        return;
      }

      // ตรวจสอบ token expiration
      try {
        const decodedToken: { exp?: number } = jwtDecode(token);
        if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
          localStorage.clear();
          navigate("/");
          return;
        }
        
        // ถ้าผ่านการตรวจสอบทั้งหมด
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.clear();
        navigate("/");
        return;
      }
    };

    checkAuth();
  }, [navigate]);

  // แสดง loading ขณะตรวจสอบ authentication
  if (isAuthenticated === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // แสดง children เฉพาะเมื่อ authenticated แล้ว
  return isAuthenticated ? <>{children}</> : null;
}; 