import { createContext, useState, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Create context
const AdminContext = createContext(null);

// Provider component
export function AdminProvider({ children }) {
  const queryClient = useQueryClient();
  const [admin, setAdmin] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Check if user is already logged in
  const { data } = useQuery({
    queryKey: ["/api/admin/session"],
    refetchOnWindowFocus: false,
  });
  
  useEffect(() => {
    if (data !== undefined) {
      if (data.isAuthenticated) {
        setAdmin(data.admin);
      } else {
        setAdmin(null);
      }
      setCheckingAuth(false);
    }
  }, [data]);
  
  // Login function
  const login = (adminData) => {
    setAdmin(adminData);
  };
  
  // Logout function
  const logout = () => {
    setAdmin(null);
    // Invalidate queries to refetch data
    queryClient.invalidateQueries();
  };
  
  const value = {
    admin,
    isAuthenticated: !!admin,
    checkingAuth,
    login,
    logout,
  };
  
  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

// Hook for using the admin context
export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
