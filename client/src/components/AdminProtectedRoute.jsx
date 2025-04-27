import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAdmin } from "@/context/AdminContext";

export default function AdminProtectedRoute({ children }) {
  const [, navigate] = useLocation();
  const { isAuthenticated, checkingAuth } = useAdmin();
  
  useEffect(() => {
    if (!checkingAuth && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, checkingAuth, navigate]);
  
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  // Only render children if user is authenticated
  return isAuthenticated ? children : null;
}
