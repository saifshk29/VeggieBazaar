import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/context/AdminContext";
import { formatCurrency, formatDate, formatStatus } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import ProductModal from "@/components/ProductModal";
import { LogOut, Plus, Search, Edit, Trash2 } from "lucide-react";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { logout } = useAdmin();
  const queryClient = useQueryClient();
  
  // State
  const [orderFilter, setOrderFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  // Fetch data
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
  });
  
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });
  
  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await apiRequest("PUT", `/api/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order status updated",
        description: "The order status has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update order status",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId) => {
      await apiRequest("DELETE", `/api/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout");
      logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  // Filter orders based on status and search term
  const filteredOrders = orders.filter(order => {
    const matchesStatus = orderFilter === "all" || order.status === orderFilter;
    const matchesSearch = 
      order.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customerName.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.category.toLowerCase().includes(productSearch.toLowerCase())
  );
  
  // Handle order status update
  const handleUpdateOrderStatus = (orderId, currentStatus) => {
    let newStatus;
    
    if (currentStatus === "pending") {
      newStatus = "in_progress";
    } else if (currentStatus === "in_progress") {
      newStatus = "delivered";
    } else {
      // Already delivered, can't update further
      return;
    }
    
    updateOrderStatusMutation.mutate({ orderId, status: newStatus });
  };
  
  // Handle product edit
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setProductModalOpen(true);
  };
  
  // Handle product add
  const handleAddProduct = () => {
    setCurrentProduct(null);
    setProductModalOpen(true);
  };
  
  // Handle product delete
  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId);
    }
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <Button 
            variant="destructive"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="orders">Order Management</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
          </TabsList>
          
          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Order Management</h3>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <div className="relative w-full sm:w-auto">
                      <Select 
                        value={orderFilter}
                        onValueChange={setOrderFilter}
                      >
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Orders</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="relative w-full sm:w-auto">
                      <Input
                        type="text"
                        placeholder="Search orders..."
                        className="pl-10 pr-4 py-2"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                {ordersLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading orders...</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No orders found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderId}</TableCell>
                          <TableCell>
                            {order.customerName}<br />
                            <span className="text-xs text-gray-500">{order.customerPhone}</span>
                          </TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>{order.items.length} items</TableCell>
                          <TableCell>{formatCurrency(order.total)}</TableCell>
                          <TableCell>
                            <OrderStatusBadge status={order.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="link"
                                size="sm"
                                className="text-primary-600 h-auto p-0"
                                onClick={() => navigate(`/track-order/${order.orderId}`)}
                              >
                                View
                              </Button>
                              
                              {order.status !== "delivered" && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="text-secondary-600 h-auto p-0"
                                  onClick={() => handleUpdateOrderStatus(order.orderId, order.status)}
                                >
                                  Update
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Inventory Management</h3>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <div className="relative w-full sm:w-auto">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        className="pl-10 pr-4 py-2"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleAddProduct}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add New Product
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                {productsLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading products...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No products found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img 
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={product.imageUrl}
                                  alt={product.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            {formatCurrency(Number(product.price))}/{product.unit}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="link"
                                size="sm"
                                className="text-primary-600 h-auto p-0 flex items-center"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              
                              <Button
                                variant="link"
                                size="sm"
                                className="text-red-600 h-auto p-0 flex items-center"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Product Modal */}
      <ProductModal
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        product={currentProduct}
      />
    </div>
  );
}
