import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-16 bg-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white">
            Ready to transform your images?
          </h2>
          <p className="mt-4 text-xl text-primary-100">
            Join thousands of satisfied users who use Backdrop every day.
          </p>
          <div className="mt-8 flex justify-center">
            <a href="#upload-section">
              <Button className="bg-white text-primary-700 hover:bg-gray-50 mr-3">
                Start for free
              </Button>
            </a>
            <a href="#pricing">
              <Button className="bg-primary-800 hover:bg-primary-900">
                View pricing
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
