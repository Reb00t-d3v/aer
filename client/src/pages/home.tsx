import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <>
      {/* Background decorative blobs */}
      <div className="fixed top-24 right-5 md:right-20 w-64 h-64 blob opacity-20 z-0"></div>
      <div className="fixed bottom-10 left-10 md:left-24 w-80 h-80 blob opacity-20 z-0"></div>
      
      {/* Hero Section */}
      <section className="pt-12 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <motion.div 
              className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="mt-4 text-4xl tracking-tight font-montserrat font-extrabold sm:text-5xl">
                <span className="block text-gray-900 dark:text-white">Remove Background</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-500">In Seconds</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
                Instantly remove the background from your images with our AI-powered tool. Get professional results in seconds, no design skills required.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                <p className="text-base font-medium text-gray-900 dark:text-gray-200">
                  Try it for free, no account required.
                </p>
                <div className="mt-5">
                  <Link href="/tool">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-8"
                    >
                      Try it now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="mt-12 lg:mt-0 lg:col-span-6 z-10 relative"
              initial={{ opacity: 0, x: 20, rotate: -2 }}
              animate={{ opacity: 1, x: 0, rotate: -2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ rotate: 0 }}
            >
              <div className="lg:absolute lg:inset-y-0 lg:right-0">
                <div className="shadow-xl rounded-2xl overflow-hidden transform transition-all lg:-rotate-2 hover:rotate-0 duration-300 gradient-border">
                  <img 
                    className="w-full object-cover" 
                    src="https://images.unsplash.com/photo-1615617396130-db493d04e2c5?fit=crop&w=800&h=500&q=80" 
                    alt="Before and after background removal example" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-transparent"></div>
                  <div className="absolute bottom-5 left-5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                      <span className="font-medium">Before & After</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* How It Works - Shortened version */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-montserrat text-gray-900 dark:text-white">How It Works</h2>
            <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300 mx-auto">
              Our AI-powered tool makes background removal simple, fast, and hassle-free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col items-center text-center transition-all duration-200 hover:shadow-md hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">1. Upload Your Image</h3>
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                Select any image from your device or drag and drop it onto the upload area.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col items-center text-center transition-all duration-200 hover:shadow-md hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">2. Processing</h3>
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                Our AI instantly analyzes your image and removes the background with high precision.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col items-center text-center transition-all duration-200 hover:shadow-md hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">3. Download Result</h3>
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                Preview your image and download in PNG format with transparent background.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-montserrat text-gray-900 dark:text-white">Ready to Remove Backgrounds?</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Start with a free trial today. No credit card required.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link href="/tool">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  Try it free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="text-purple-600 border-purple-600 hover:bg-purple-50 dark:hover:bg-gray-700">
                  View pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blob-small opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-64 h-64 blob-small opacity-20"></div>
      </section>
    </>
  );
};

export default Home;
