import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/">
              <span className="text-2xl font-bold text-primary-500 cursor-pointer">FreshBulk</span>
            </Link>
            <p className="mt-4 text-gray-400">
              Premium quality vegetables and fruits delivered directly from farms to your doorstep.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-primary-500">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary-500">Home</Link>
              </li>
              <li>
                <Link href="/place-order" className="text-gray-400 hover:text-primary-500">Place Order</Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-400 hover:text-primary-500">Track Order</Link>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-primary-500">About Us</a>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-primary-500">Vegetables</a>
              </li>
              <li>
                <a href="/" className="text-gray-400 hover:text-primary-500">Fruits</a>
              </li>
              <li>
                <a href="/" className="text-gray-400 hover:text-primary-500">Seasonal Produce</a>
              </li>
              <li>
                <a href="/" className="text-gray-400 hover:text-primary-500">Organic Products</a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
                <span className="text-gray-400">123 Farm Street, Green Valley, GV 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary-500 mr-2" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary-500 mr-2" />
                <span className="text-gray-400">support@freshbulk.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} FreshBulk. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0">
            <a href="#" className="text-gray-400 hover:text-primary-500 text-sm mr-4">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-primary-500 text-sm mr-4">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-primary-500 text-sm">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}