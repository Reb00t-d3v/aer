import { Star } from "lucide-react";

interface Testimonial {
  text: string;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    text: "This tool is a game-changer for my e-commerce business. I can quickly remove backgrounds from product images with perfect results every time.",
    author: {
      name: "Sarah Johnson",
      role: "E-commerce Owner",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    rating: 5,
  },
  {
    text: "The batch processing feature saves me hours every week. The results are consistently perfect, even with complex subjects like hair and fur.",
    author: {
      name: "Mark Wilson",
      role: "Photographer",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    rating: 5,
  },
  {
    text: "As a graphic designer, I've tried many background removal tools. This one is by far the best in terms of quality and ease of use. The UI is clean and intuitive.",
    author: {
      name: "Lisa Chen",
      role: "Graphic Designer",
      avatarUrl: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What our users say</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied customers using our background removal tool.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-primary">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                "{testimonial.text}"
              </p>
              <div className="flex items-center">
                <img 
                  className="h-10 w-10 rounded-full mr-3" 
                  src={testimonial.author.avatarUrl} 
                  alt={testimonial.author.name}
                />
                <div>
                  <p className="font-medium">{testimonial.author.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.author.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
