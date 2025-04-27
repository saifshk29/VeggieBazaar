import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ShoppingCart, Plus, Minus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function PlaceOrder() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  
  // Cart state
  const [cart, setCart] = useState([]);
  
  // Fetch products
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });
  
  // Place order mutation
  const placeMutation = useMutation({
    mutationFn: async (orderData) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Order Placed Successfully!",
        description: `Your order ID is ${data.orderId}. You can track your order status.`,
      });
      navigate(`/track-order/${data.orderId}`);
    },
    onError: (error) => {
      toast({
        title: "Failed to place order",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
        localStorage.removeItem("cart");
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  
  // Add product to cart
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { 
          productId: product.id,
          quantity: 1,
          product
        }];
      }
    });
  };
  
  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };
  
  // Update product quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };
  
  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + (Number(item.product.price) * item.quantity);
    }, 0);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast({
        title: "No items in cart",
        description: "Please add at least one item to your order.",
        variant: "destructive",
      });
      return;
    }
    
    const orderData = {
      customerName,
      customerPhone,
      customerAddress,
      city,
      pincode,
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };
    
    placeMutation.mutate(orderData);
  };
  
  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Place Bulk Order</h1>
        
        <form className="bg-white shadow-sm rounded-lg p-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
              
              {cart.length === 0 ? (
                <div className="mt-4 border-t border-b border-gray-200 py-8 text-center">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No items in your cart</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start by adding some products to your order
                  </p>
                  <div className="mt-6">
                    <Button
                      type="button"
                      onClick={() => navigate("/")}
                      className="inline-flex items-center px-4 py-2"
                    >
                      Browse Products
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 border-t border-b border-gray-200">
                  {cart.map((item) => (
                    <div key={item.productId} className="py-4 flex justify-between items-center border-b border-gray-200 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-800">{item.product.name}</p>
                        <p className="text-sm text-gray-500">{formatCurrency(Number(item.product.price))}/{item.product.unit}</p>
                      </div>
                      <div className="flex items-center">
                        <button 
                          type="button"
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                          className="block w-16 mx-2 text-center"
                        />
                        <button 
                          type="button"
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <span className="ml-2 text-sm text-gray-500">{item.product.unit}</span>
                        <button 
                          type="button" 
                          className="ml-4 text-red-500 hover:text-red-700"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="py-4 flex justify-between">
                    <span className="font-medium">Total:</span>
                    <span className="font-medium">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              )}
              
              {/* Add more products button */}
              {cart.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                    className="text-sm"
                  >
                    Add More Products
                  </Button>
                </div>
              )}
              
              {/* Product list for quick add */}
              {cart.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Add:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {products
                      .filter(p => !cart.find(item => item.productId === p.id))
                      .slice(0, 6)
                      .map(product => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => addToCart(product)}
                          className="text-left p-2 text-xs border border-gray-200 rounded-md hover:bg-gray-50 flex justify-between items-center"
                        >
                          <span>{product.name}</span>
                          <Plus className="h-3 w-3 text-primary-600" />
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <h2 className="text-lg font-medium text-gray-900">Delivery Information</h2>
              </div>
              
              <div>
                <Label htmlFor="full-name">Full Name</Label>
                <div className="mt-1">
                  <Input 
                    id="full-name" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="mt-1">
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <Label htmlFor="address">Delivery Address</Label>
                <div className="mt-1">
                  <Textarea 
                    id="address" 
                    rows={3} 
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="city">City</Label>
                <div className="mt-1">
                  <Input 
                    id="city" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="pincode">PIN Code</Label>
                <div className="mt-1">
                  <Input 
                    id="pincode" 
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="mr-4"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={cart.length === 0 || placeMutation.isPending}
            >
              {placeMutation.isPending ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
