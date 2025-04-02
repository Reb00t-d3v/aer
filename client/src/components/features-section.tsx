import { Zap, Image, Layers } from "lucide-react";

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "Instant Processing",
    description: "Our advanced AI processes your images in seconds, not minutes. Save time and boost your productivity.",
  },
  {
    icon: <Image className="h-6 w-6 text-primary" />,
    title: "High Quality Results",
    description: "Get pixel-perfect results with superior edge detection that perfectly preserves fine details like hair and fur.",
  },
  {
    icon: <Layers className="h-6 w-6 text-primary" />,
    title: "Batch Processing",
    description: "Upload and process multiple images at once. Save time with our efficient bulk processing capabilities.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our AI-powered tool makes removing backgrounds simple, fast, and accurate.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 transition-transform duration-300 hover:scale-105"
            >
              <div className="h-12 w-12 bg-primary-light bg-opacity-20 rounded-lg flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
