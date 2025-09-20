import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Layout } from "./components/layouts/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { ErrorPage } from "./pages/Errort";
import { Register } from "./pages/Auth/Register";
import { Login } from "./pages/Auth/Login";
import { Dashboard } from "./pages/Admin/Dashboard";
import { ManageCategory } from "./pages/Admin/ManageCategory";
import { ManageBorrow } from "./pages/Admin/ManageBorrow";
import BorrowerDashboard from "./pages/Borrower/Dashboard";
import MyBorrows from "./pages/Borrower/MyBorrows";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<ErrorPage />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route 
            path="/admin/manage-category" 
            element={
              <AdminRoute>
                <ManageCategory />
              </AdminRoute>
            }
          />
          <Route 
            path="/admin/manage-borrow" 
            element={
              <AdminRoute>
                <ManageBorrow />
              </AdminRoute>
            }
          />
          
          {/* User/Borrower Routes */}
          <Route 
            path="/user/dashboard" 
            element={<BorrowerDashboard />}
          />
          <Route 
            path="/user/my-borrows" 
            element={<MyBorrows />}
          />
        </Route>
      </Routes>
      <ToastContainer aria-label="Notification Container" />
    </>
  );
};

export default App;
