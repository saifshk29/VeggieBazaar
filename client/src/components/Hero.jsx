import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Hero() {
  const [, navigate] = useLocation();

  return (
    <div className="relative bg-gradient-to-r from-green-50 via-gray-50 to-green-100 overflow-hidden py-12 border-b border-green-100">
      <div className="absolute inset-0 bg-[url('/pattern-bg.svg')] opacity-5"></div>
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <div className="pt-10 sm:pt-16 lg:pt-8 xl:pt-12">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <div className="flex items-center mb-4 lg:justify-start sm:justify-center">
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">100% Fresh & Organic</span>
                </div>
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Fresh Produce</span>
                  <span className="block text-green-600">Delivered in Bulk</span>
                </h1>
                <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Order fresh vegetables and fruits in bulk directly from farms. 
                  Perfect for restaurants, grocery stores, or large families.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Button 
                      className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      onClick={() => navigate("/place-order")}
                    >
                      Place Order
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Button 
                      className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
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
        <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern-bg.svg')] opacity-5"></div>
          <div className="relative grid grid-cols-3 gap-4 p-4 transform rotate-12 scale-110">
            <div className="bg-white p-2 rounded-xl shadow-md transform -rotate-6 hover:scale-105 transition-transform">
              <div className="w-full h-24 flex items-center justify-center text-5xl">🥦</div>
              <div className="text-center text-sm font-medium text-gray-700 mt-1">Broccoli</div>
            </div>
            <div className="bg-white p-2 rounded-xl shadow-md transform rotate-3 hover:scale-105 transition-transform">
              <div className="w-full h-24 flex items-center justify-center text-5xl">🍎</div>
              <div className="text-center text-sm font-medium text-gray-700 mt-1">Apples</div>
            </div>
            <div className="bg-white p-2 rounded-xl shadow-md transform -rotate-6 hover:scale-105 transition-transform">
              <div className="w-full h-24 flex items-center justify-center text-5xl">🥕</div>
              <div className="text-center text-sm font-medium text-gray-700 mt-1">Carrots</div>
            </div>
            <div className="bg-white p-2 rounded-xl shadow-md transform rotate-6 hover:scale-105 transition-transform">
              <div className="w-full h-24 flex items-center justify-center text-5xl">🍊</div>
              <div className="text-center text-sm font-medium text-gray-700 mt-1">Oranges</div>
            </div>
            <div className="bg-white p-2 rounded-xl shadow-md transform -rotate-3 hover:scale-105 transition-transform">
              <div className="w-full h-24 flex items-center justify-center text-5xl">🥑</div>
              <div className="text-center text-sm font-medium text-gray-700 mt-1">Avocados</div>
            </div>
            <div className="bg-white p-2 rounded-xl shadow-md transform rotate-6 hover:scale-105 transition-transform">
              <div className="w-full h-24 flex items-center justify-center text-5xl">🍇</div>
              <div className="text-center text-sm font-medium text-gray-700 mt-1">Grapes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}