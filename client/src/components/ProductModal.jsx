import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductModal({ open, onClose, product }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Vegetable");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [imageUrl, setImageUrl] = useState("");
  
  // Set initial values when product changes
  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price);
      setUnit(product.unit);
      setImageUrl(product.imageUrl || "");
    } else {
      // Reset form for new product
      setName("");
      setCategory("Vegetable");
      setPrice("");
      setUnit("kg");
      setImageUrl("");
    }
  }, [product]);
  
  // Create/update product mutation
  const productMutation = useMutation({
    mutationFn: async (productData) => {
      let response;
      
      if (product) {
        // Update existing product
        response = await apiRequest("PUT", `/api/products/${product.id}`, productData);
      } else {
        // Create new product
        response = await apiRequest("POST", "/api/products", productData);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: product ? "Product updated" : "Product added",
        description: product 
          ? "The product has been updated successfully" 
          : "The product has been added successfully",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: product ? "Failed to update product" : "Failed to add product",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle save
  const handleSave = (e) => {
    e.preventDefault();
    
    if (!name || !price) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const productData = {
      name,
      category,
      price: price.toString(),
      unit,
      imageUrl: imageUrl || undefined,
    };
    
    productMutation.mutate(productData);
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">Product Name</Label>
            <Input
              id="product-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tomatoes"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="product-category">Category</Label>
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger id="product-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vegetable">Vegetable</SelectItem>
                <SelectItem value="Fruit">Fruit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-price">Price</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <Input
                  id="product-price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="pl-7"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product-unit">Unit</Label>
              <Select
                value={unit}
                onValueChange={setUnit}
              >
                <SelectTrigger id="product-unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="dozen">dozen</SelectItem>
                  <SelectItem value="piece">piece</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="product-image">Image URL</Label>
            <Input
              id="product-image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500">
              Leave empty to use a default image
            </p>
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={productMutation.isPending}
            >
              {productMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
