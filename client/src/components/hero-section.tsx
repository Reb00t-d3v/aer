import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    let clientX: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    
    const position = ((clientX - containerRect.left) / containerRect.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  const handleMouseDown = () => {
    if (!containerRef.current) return;
    
    const handleMove = (e: MouseEvent) => {
      const containerRect = containerRef.current!.getBoundingClientRect();
      const position = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      setSliderPosition(Math.min(Math.max(position, 0), 100));
    };
    
    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  return (
    <section className="relative bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-300 min-h-[90vh] flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-purple-500/10 rounded-full animate-float-slow blur-2xl"></div>
        <div className="absolute top-[50%] right-[10%] w-48 h-48 bg-indigo-500/10 rounded-full animate-float-medium blur-xl"></div>
        <div className="absolute bottom-[15%] left-[15%] w-36 h-36 bg-blue-500/10 rounded-full animate-float-fast blur-3xl"></div>
        <div className="absolute top-[20%] right-[25%] w-24 h-24 bg-purple-400/10 rounded-full animate-pulse-glow blur-xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <div className="text-base max-w-prose lg:max-w-none">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-block rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 mb-4 text-sm font-medium text-purple-800 dark:text-purple-200"
              >
                AI-Powered Technology
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-2 text-4xl leading-tight font-bold text-gray-900 dark:text-white sm:text-5xl"
              >
                Remove Image <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400 relative">
                  Backgrounds
                  <motion.span 
                    className="absolute bottom-1 left-0 h-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  />
                </span> in Seconds
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 text-xl text-gray-500 dark:text-gray-300"
              >
                Instantly remove backgrounds from images with our powerful AI technology. 
                Perfect for e-commerce, designers, social media, and more.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-10"
              >
                <a href="#upload-section">
                  <Button size="lg" className="mr-4 relative overflow-hidden group">
                    <span className="relative z-10">Try it now — Free</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  </Button>
                </a>
                <a href="#how-it-works">
                  <Button variant="outline" size="lg">
                    Learn more
                  </Button>
                </a>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-3 text-sm text-gray-500 dark:text-gray-400"
                >
                  No credit card required. One free removal for all users.
                </motion.p>
              </motion.div>
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg lg:mt-0 lg:col-span-6 lg:flex lg:items-center">
            <motion.div 
              className="relative mx-auto w-full rounded-lg lg:max-w-md"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.7, 
                delay: 0.6,
                type: "spring",
                damping: 20
              }}
            >
              {/* Decorative elements around the image */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-float-slow"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl animate-float-medium"></div>
              
              <div className="relative block w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl">
                <div className="relative h-80 w-full overflow-hidden" ref={containerRef}>
                  {/* Before image (with background) */}
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" 
                    alt="Portrait with background" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* After image (without background) */}
                  <div 
                    className="absolute inset-0 h-full overflow-hidden" 
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <div className="absolute inset-0 bg-[#5a189a] opacity-30 mix-blend-color" />
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" 
                      alt="Portrait without background" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-grid-pattern bg-[length:20px_20px]" />
                  </div>
                  
                  {/* Labels */}
                  <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">Original</div>
                  <div className="absolute top-3 right-3 bg-primary/80 text-white text-xs px-2 py-1 rounded">Processed</div>
                  
                  {/* Slider */}
                  <motion.div 
                    ref={sliderRef}
                    className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize"
                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                    onMouseDown={handleMouseDown}
                    onTouchMove={handleSliderMove}
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <motion.div 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 10, delay: 1.2 }}
                    >
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full" />
                    </motion.div>
                  </motion.div>
                </div>
                
                {/* Caption */}
                <motion.div 
                  className="py-3 px-4 text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  Drag the slider to see the before & after effect
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
