import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import ProductCard from "@/components/ProductCard";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";

const ITEMS_PER_PAGE = 8;

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("all");
  
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["/api/products"],
  });

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    // First filter by category
    const categoryMatch = 
      activeCategory === "all" || 
      (activeCategory === "fruit" && product.category.toLowerCase() === "fruit") ||
      (activeCategory === "vegetable" && product.category.toLowerCase() === "vegetable");
    
    // Then filter by search term
    const searchMatch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  // Paginate products
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductSelect = (product) => {
    // We'll handle this in the cart context later
    console.log("Selected product:", product);
    setLocation("/place-order");
  };

  if (isLoading) {
    return (
      <div>
        {/* Hero Skeleton */}
        <div className="relative bg-gradient-to-r from-primary-50 to-primary-100 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <div className="pt-10 sm:pt-16 lg:pt-8 xl:pt-12">
                <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                  <div className="sm:text-center lg:text-left">
                    <div className="h-10 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
                    <div className="h-10 bg-gray-300 rounded animate-pulse mb-8 w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-full"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-8 w-4/5"></div>
                    <div className="flex space-x-4">
                      <div className="h-10 bg-primary-200 rounded animate-pulse w-32"></div>
                      <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-tr from-primary-200 to-primary-300 animate-pulse"></div>
          </div>
        </div>
        
        {/* Products Skeleton */}
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-8 w-64 mx-auto"></div>
            
            {/* Filter Tabs Skeleton */}
            <div className="flex justify-center mb-8 space-x-2">
              <div className="h-10 bg-gray-200 rounded-full animate-pulse w-24"></div>
              <div className="h-10 bg-gray-200 rounded-full animate-pulse w-28"></div>
              <div className="h-10 bg-gray-200 rounded-full animate-pulse w-20"></div>
            </div>
            
            {/* Search Skeleton */}
            <div className="h-10 bg-gray-200 rounded animate-pulse mb-8 w-64 mx-auto"></div>
            
            {/* Product Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                  <div className="h-48 w-full bg-gray-300 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> Unable to load products. Please try again later.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <Hero />
      
      {/* Products Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Fresh Products</h2>
          
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap mb-6 gap-2 justify-center">
            <Button 
              variant={activeCategory === "all" ? "default" : "outline"}
              onClick={() => handleCategoryChange("all")}
              className="rounded-full"
            >
              All Products
            </Button>
            <Button 
              variant={activeCategory === "vegetable" ? "default" : "outline"}
              onClick={() => handleCategoryChange("vegetable")}
              className="rounded-full"
            >
              Vegetables
            </Button>
            <Button 
              variant={activeCategory === "fruit" ? "default" : "outline"}
              onClick={() => handleCategoryChange("fruit")}
              className="rounded-full"
            >
              Fruits
            </Button>
          </div>
          
          {/* Search */}
          <div className="mb-8 max-w-md mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Product grid */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={() => handleProductSelect(product)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found matching "{searchTerm}"</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </Button>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => handlePageChange(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
      
      {/* Why Choose Us Section */}
      <WhyChooseUs />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
