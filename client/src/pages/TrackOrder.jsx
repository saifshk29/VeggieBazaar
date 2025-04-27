import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { formatCurrency, formatDate, formatStatus, getStatusPillClass } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import OrderStatusBadge from "@/components/OrderStatusBadge";

export default function TrackOrder({ params }) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // If we have an orderId from params, use it. Otherwise, let user enter one.
  const [orderId, setOrderId] = useState(params?.orderId || "");
  const [trackingId, setTrackingId] = useState(params?.orderId || "");
  
  // Query order data if we have an orderId
  const { data: order, isLoading, error } = useQuery({
    queryKey: [orderId ? `/api/orders/${orderId}` : null],
    enabled: !!orderId,
  });
  
  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast({
        title: "Order ID required",
        description: "Please enter your order ID to track your order",
        variant: "destructive",
      });
      return;
    }
    
    // Update URL and trigger query
    navigate(`/track-order/${trackingId}`);
    setOrderId(trackingId);
  };
  
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Track Your Order</h1>
          <Card className="animate-pulse">
            <CardHeader className="bg-gray-50 h-20"></CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // If no order ID is provided or we haven't searched yet
  if (!orderId) {
    return (
      <div className="py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Track Your Order</h1>
          
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleTrack} className="space-y-4">
                <div>
                  <label htmlFor="order-id" className="block text-sm font-medium text-gray-700">
                    Enter your Order ID
                  </label>
                  <div className="mt-1">
                    <Input
                      id="order-id"
                      placeholder="e.g. FB-12345"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      className="block w-full"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  Track Order
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // If there was an error fetching the order
  if (error || !order) {
    return (
      <div className="py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Track Your Order</h1>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Order not found! </strong>
                  <span className="block sm:inline">
                    We couldn't find an order with the ID "{orderId}". Please check and try again.
                  </span>
                </div>
                
                <form onSubmit={handleTrack} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="order-id" className="block text-sm font-medium text-gray-700">
                      Enter your Order ID
                    </label>
                    <div className="mt-1">
                      <Input
                        id="order-id"
                        placeholder="e.g. FB-12345"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        className="block w-full"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full sm:w-auto">
                    Track Order
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Calculate order progress based on status
  const getOrderProgress = (status) => {
    const statusMap = {
      pending: 1,
      in_progress: 2,
      delivered: 3,
    };
    return statusMap[status] || 0;
  };
  
  const orderProgress = getOrderProgress(order.status);
  
  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Track Your Order</h1>
        
        <Card className="overflow-hidden">
          <CardHeader className="px-4 py-5 sm:px-6 bg-gray-50 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order #{order.orderId}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Placed on: {formatDate(order.createdAt)}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </CardHeader>
          
          <CardContent className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium text-gray-900">Order Items</h4>
                <ul className="mt-3 divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <li key={item.id} className="py-3 flex justify-between">
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{item.product.name}</p>
                        <p className="text-gray-500">
                          {item.quantity} {item.product.unit} x {formatCurrency(Number(item.product.price))}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(Number(item.price) * Number(item.quantity))}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-base font-medium text-gray-900">Order Total</h4>
                <p className="mt-2 text-xl font-semibold text-gray-900">{formatCurrency(order.total)}</p>
              </div>
              
              <div>
                <h4 className="text-base font-medium text-gray-900">Delivery Information</h4>
                <div className="mt-2 text-sm text-gray-500">
                  <p>{order.customerName}</p>
                  <p>{order.customerAddress}</p>
                  <p>{order.city}, {order.pincode}</p>
                  <p>Phone: {order.customerPhone}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-medium text-gray-900">Order Status</h4>
                <div className="mt-4 relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-between">
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-8 h-8 ${orderProgress >= 1 ? 'bg-primary-600' : 'bg-gray-300'} rounded-full`}>
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">Pending</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-8 h-8 ${orderProgress >= 2 ? 'bg-primary-600' : 'bg-gray-300'} rounded-full`}>
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">In Progress</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-8 h-8 ${orderProgress >= 3 ? 'bg-primary-600' : 'bg-gray-300'} rounded-full`}>
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">Delivered</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
