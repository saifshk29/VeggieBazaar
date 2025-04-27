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
      className={`overflow-hidden hover:shadow-md transition-shadow duration-200 ${isHovered ? 'shadow-md' : 'shadow-sm'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-48 w-full overflow-hidden">
        <img 
          className="h-full w-full object-cover transform transition-transform duration-200 ease-in-out hover:scale-105"
          src={product.imageUrl} 
          alt={product.name}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
        <div className="mt-1 flex justify-between items-center">
          <p className="text-gray-600">{formatCurrency(Number(product.price))}/{product.unit}</p>
          <Button
            variant="ghost"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            onClick={handleAddToOrder}
          >
            Add to Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
