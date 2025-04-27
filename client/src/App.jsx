import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PlaceOrder from "@/pages/PlaceOrder";
import TrackOrder from "@/pages/TrackOrder";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AdminProvider } from "@/context/AdminContext";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

function Router() {
  const [location] = useLocation();
  
  // Don't render Navbar on admin login page
  const showNavbar = !location.startsWith("/admin/login");
  
  return (
    <>
      {showNavbar && <Navbar />}
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/place-order" component={PlaceOrder} />
        <Route path="/track-order/:orderId?" component={TrackOrder} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/dashboard">
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminProvider>
          <Toaster />
          <Router />
        </AdminProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;