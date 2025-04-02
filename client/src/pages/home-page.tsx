import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ImageProcessor from "@/components/image-processor";
import FeaturesSection from "@/components/features-section";
import PricingPlans from "@/components/pricing-plans";
import TestimonialsSection from "@/components/testimonials-section";
import FAQSection from "@/components/faq-section";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function HomePage() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20"
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                  Remove backgrounds in <span className="text-primary">seconds</span>
                </h1>
                <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
                  Instantly remove backgrounds from images with our AI-powered tool. Get perfect results every time, no design skills needed.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="#try-free">
                    <Button size="lg" className="font-semibold">
                      Try for free
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="font-semibold" onClick={scrollToFeatures}>
                    Learn more
                  </Button>
                </div>
              </div>
              <motion.div 
                className="md:w-1/2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/30 to-indigo-500/30 opacity-30 blur-lg transform -translate-y-4 translate-x-6 animate-pulse"></div>
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                      alt="Image with background removed" 
                      className="rounded-2xl shadow-lg w-full max-w-lg mx-auto" 
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="absolute top-0 right-0 -mt-5 -mr-5"
                    >
                      <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12">
                        AI-Powered
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <FeaturesSection />

        {/* Background Removal Tool */}
        <section id="try-free" className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Try it out for free</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Experience the power of our background removal tool. One free removal for non-registered users.
              </p>
            </div>

            <ImageProcessor />
          </div>
        </section>

        {/* Pricing Section */}
        <PricingPlans />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Call to Action */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to remove backgrounds like a pro?</h2>
              <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
                Join thousands of satisfied customers using our tool to create professional-looking images in seconds.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/auth?tab=signup">
                  <Button size="lg" className="font-semibold">
                    Get Started for Free
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="font-semibold" onClick={scrollToFeatures}>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
