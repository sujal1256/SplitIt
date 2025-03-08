import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewportSize, setViewportSize] = useState('desktop');

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setViewportSize('mobile');
      } else {
        setViewportSize('desktop');
      }
    };
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Sujal M.",
      quote: "SplitIt makes splitting expenses with my roommates effortless. No more awkward conversations!"
    },
    {
      id: 2,
      name: "Sachman S.",
      quote: "This app has made group trips so much more enjoyable. Tracking payments is a breeze!"
    },
    {
      id: 3,
      name: "Shriya S.",
      quote: "Finally, a simple solution for managing shared expenses with friends. Highly recommended!"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  // Testimonial Card Component
  const TestimonialCard = ({ testimonial, className = "" }) => (
    <div className={`text-center p-6 ${className}`}>
      <p className="text-lg md:text-xl italic text-gray-300 mb-6">"{testimonial.quote}"</p>
      <p className="text-orange-400 font-medium">- {testimonial.name}</p>
    </div>
  );

  return (
    <div className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-orange-400 mb-4">
            What Our Users Say
          </h2>
          <div className="w-16 h-1 bg-orange-400 mx-auto"></div>
        </div>

        {/* Desktop View - Show all three testimonials */}
        <div className="hidden md:flex justify-between gap-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex-1 max-w-md">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>

        {/* Mobile View - Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="min-w-full">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Carousel Controls */}
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full border border-gray-700 hover:bg-gray-700 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full border border-gray-700 hover:bg-gray-700 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>

          {/* Indicator Dots for Mobile */}
          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full ${
                  currentSlide === index ? "bg-orange-400" : "bg-gray-600"
                } transition-colors`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;