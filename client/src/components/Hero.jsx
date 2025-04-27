import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Hero() {
  const [, navigate] = useLocation();

  return (
    <div className="relative bg-gradient-to-r from-primary-50 to-primary-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <div className="pt-10 sm:pt-16 lg:pt-8 xl:pt-12">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Fresh Produce</span>
                  <span className="block text-primary-600">Delivered in Bulk</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Order fresh vegetables and fruits in bulk directly from farms. 
                  Perfect for restaurants, grocery stores, or large families.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Button 
                      className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      onClick={() => navigate("/place-order")}
                    >
                      Place Order
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Button 
                      className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
                      variant="outline"
                      onClick={() => navigate("/track-order")}
                    >
                      Track Order
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-tr from-primary-200 to-primary-300 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="text-6xl mb-2">🥦 🍎</div>
            <div className="text-5xl mb-2">🍊 🥕</div>
            <div className="text-6xl">🥑 🍇</div>
          </div>
        </div>
      </div>
    </div>
  );
}