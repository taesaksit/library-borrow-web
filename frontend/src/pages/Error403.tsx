import { Shield, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Error403 = () => {
  const navigate = useNavigate();

  return (
    <div className=" mx-auto min-h-screen flex items-center justify-center px-4">
      <div className=" bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center  mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          403 - Access Forbidden
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Sorry, you don't have permission to access this page. This area is
          restricted to administrators only.
        </p>

        <div className="space-y-4">
          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center justify-center gap-2 h-12"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full h-12 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Login
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact your system
            administrator.
          </p>
        </div>
      </div>
    </div>
  );
};
