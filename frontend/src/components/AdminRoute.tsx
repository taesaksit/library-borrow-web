import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Error403 } from "@/pages/Error403";
import { isAuthenticated, isAdmin, clearAuthData } from "@/lib/auth";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthorization = () => {
      // ตรวจสอบ authentication
      if (!isAuthenticated()) {
        clearAuthData();
        navigate("/");
        return;
      }

      // ตรวจสอบ role - เฉพาะ admin เท่านั้นที่เข้าถึงได้
      if (!isAdmin()) {
        setIsAuthorized(false);
        return;
      }
      
      // ถ้าผ่านการตรวจสอบทั้งหมด
      setIsAuthorized(true);
    };

    checkAuthorization();
  }, [navigate]);

  // แสดง loading ขณะตรวจสอบ authorization
  if (isAuthorized === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // แสดง children เฉพาะเมื่อ authorized แล้ว
  if (isAuthorized === true) {
    return <>{children}</>;
  } else if (isAuthorized === false) {
    return <Error403 />;
  }
  
  return null;
}; 