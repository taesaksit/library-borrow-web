import { useNavigate } from "react-router-dom";
import { BookOpen, LogOut, User } from "lucide-react";

import { Button } from "../ui/button";
import { handleLogout } from "@/services/auth/functions/handle-logout";

interface NavigationItem {
  name: string;
  path: string;
}

export const NavbarComponent = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const pathName = window.location.pathname.split("/")[3];

  let navigation: NavigationItem[] = [];
  if (role === "admin") {
    
    navigation = [
      { name: "Dashboard", path: "/admin/dashboard" },
      { name: "Manage Categories", path: "/admin/manage-category" },
      { name: "Manage Borrow", path: "/admin/manage-borrow" },
    ];
  } else if (role === "borrower") {
    navigation = [
      { name: "Books", path: "/user/dashboard" },
      { name: "My Borrows", path: "/user/my-borrows" },
    ];
  }

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Library Management System
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Book Borrowing & Return System
              </span>
            </div>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`text-sm font-semibold hover:text-sky-500 hover:scale-110 active:scale-90 duration-300 ease-in-out ${
                  pathName === item.path.split("/")[2]
                    ? "text-sky-500 scale-110 font-bold border-b-2 border-sky-200"
                    : "text-gray-700"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Right Side - User Info + Logout */}
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900"></span>
                <span className="text-xs text-gray-500">{name}</span>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              onClick={() => handleLogout(navigate)}
              variant="outline"
              size="lg"
              className="flex items-center gap-2 hover:cursor-pointer hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
