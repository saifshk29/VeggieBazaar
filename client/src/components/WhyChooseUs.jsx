import { Truck, Heart, BarChart3, Shield } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Truck className="h-10 w-10 text-primary-600" />,
      title: "Fast Delivery",
      description: "We deliver your orders within 24 hours to ensure maximum freshness of produce."
    },
    {
      icon: <Heart className="h-10 w-10 text-primary-600" />,
      title: "100% Fresh",
      description: "Our vegetables and fruits are harvested daily from local farms for ultimate freshness."
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-primary-600" />,
      title: "Best Prices",
      description: "We offer competitive bulk pricing with discounts for regular customers."
    },
    {
      icon: <Shield className="h-10 w-10 text-primary-600" />,
      title: "Quality Guarantee",
      description: "Not satisfied with the quality? We'll replace it or refund your money."
    }
  ];

  return (
    <section className="py-16 bg-gray-50" id="why-choose-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose FreshBulk</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to providing the freshest produce at the best prices, delivered straight to your door.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}