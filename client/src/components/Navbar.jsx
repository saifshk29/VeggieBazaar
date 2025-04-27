import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAdmin } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { isAuthenticated } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Check if we're on the admin dashboard
  const isAdminDashboard = location.startsWith("/admin/dashboard");
  
  // Handle scroll for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Don't show navbar on admin dashboard
  if (isAdminDashboard) {
    return null;
  }
  
  return (
    <nav className={`bg-white ${isScrolled ? 'shadow-md' : 'shadow-sm'} sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-xl font-bold text-primary-600 cursor-pointer">FreshBulk</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <a className={`${location === '/' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Products
                </a>
              </Link>
              <Link href="/place-order">
                <a className={`${location === '/place-order' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Place Order
                </a>
              </Link>
              <Link href="/track-order">
                <a className={`${location.startsWith('/track-order') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Track Order
                </a>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <Link href="/admin/dashboard">
                <Button variant="primary" size="sm">
                  Admin Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/admin/login">
                <Button variant="primary" size="sm">
                  Admin Login
                </Button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <div className="ml-2 flex items-center sm:hidden">
              <button
                type="button"
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/">
            <a 
              className={`${location === '/' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </a>
          </Link>
          <Link href="/place-order">
            <a 
              className={`${location === '/place-order' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Place Order
            </a>
          </Link>
          <Link href="/track-order">
            <a 
              className={`${location.startsWith('/track-order') ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Track Order
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
