import { useState } from "react";
import { Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "FreshBulk has transformed our restaurant's supply chain. The produce is always fresh, and the bulk ordering system saves us both time and money.",
      author: "John Smith",
      role: "Restaurant Owner",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "As a grocery store manager, I appreciate the consistent quality and timely deliveries. Their order tracking system is extremely helpful for our inventory management.",
      author: "Laura Johnson",
      role: "Grocery Store Manager",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "We've been ordering our weekly family groceries in bulk from FreshBulk for over a year now. The quality is exceptional and the prices are unbeatable.",
      author: "Michael Davis",
      role: "Customer",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    }
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what some of our satisfied customers have to say.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-primary-50 rounded-lg p-8 md:p-12 shadow-sm">
            <div className="flex justify-center mb-6">
              <Quote className="h-12 w-12 text-primary-400 rotate-180" />
            </div>
            
            <blockquote className="text-xl md:text-2xl text-gray-800 text-center mb-8">
              {testimonials[currentIndex].quote}
            </blockquote>
            
            <div className="flex flex-col items-center">
              <img 
                src={testimonials[currentIndex].avatar} 
                alt={testimonials[currentIndex].author}
                className="w-16 h-16 rounded-full object-cover mb-4" 
              />
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {testimonials[currentIndex].author}
                </div>
                <div className="text-primary-600">
                  {testimonials[currentIndex].role}
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-center mt-8 space-x-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
            >
              &larr;
            </Button>
            
            {testimonials.map((_, index) => (
              <Button 
                key={index}
                variant={currentIndex === index ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentIndex(index)}
                className="w-2 h-2 p-2 rounded-full"
              >
                <span className="sr-only">Testimonial {index + 1}</span>
              </Button>
            ))}
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
            >
              &rarr;
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}