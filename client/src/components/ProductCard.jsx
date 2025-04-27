import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProductCard({ product, onSelect }) {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleAddToOrder = () => {
    // Get cart from localStorage or initialize empty array
    let cart = [];
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    
    // Check if product already in cart
    const existingItemIndex = cart.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex !== -1) {
      // Update quantity if product already in cart
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new product to cart
      cart.push({
        productId: product.id,
        quantity: 1,
        product
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Show success toast
    toast({
      title: "Added to order",
      description: `${product.name} has been added to your order.`,
    });
    
    // Call onSelect callback if provided
    if (onSelect) {
      onSelect(product);
    }
  };
  
  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${isHovered ? 'shadow-md transform -translate-y-1' : 'shadow-sm'} group rounded-xl border border-gray-100`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-48 w-full overflow-hidden relative">
        <div className="absolute top-2 right-2 z-10">
          <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-500 text-white rounded-full">
            {product.category}
          </span>
        </div>
        <img 
          className="h-full w-full object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-110"
          src={product.imageUrl} 
          alt={product.name}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200">{product.name}</h3>
        <div className="mt-2 mb-2 flex items-center">
          <div className="mr-1 text-yellow-500">★★★★★</div>
          <span className="text-xs text-gray-500">5.0</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-green-600 font-bold">{formatCurrency(Number(product.price))}/{product.unit}</p>
          <Button
            variant="ghost"
            className="text-green-600 hover:text-green-700 hover:bg-green-50 text-sm font-medium rounded-full"
            onClick={handleAddToOrder}
          >
            Add to Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
