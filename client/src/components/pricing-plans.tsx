import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  features: Array<{
    text: string;
    included: boolean;
  }>;
  popular?: boolean;
}

export default function PricingPlans() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [, navigate] = useLocation();

  const plans: PricingPlan[] = [
    {
      id: "free",
      name: "Free",
      description: "For casual users",
      price: "$0",
      features: [
        { text: "1 free image per day", included: true },
        { text: "Standard quality", included: true },
        { text: "No batch processing", included: false },
        { text: "No image history", included: false },
      ],
    },
    {
      id: "premium",
      name: "Premium",
      description: "For professionals",
      price: "$9.99",
      features: [
        { text: "100 images per month", included: true },
        { text: "High quality processing", included: true },
        { text: "Batch processing (10 at once)", included: true },
        { text: "30-day image history", included: true },
      ],
      popular: true,
    },
    {
      id: "business",
      name: "Business",
      description: "For teams & businesses",
      price: "$29.99",
      features: [
        { text: "Unlimited images", included: true },
        { text: "Ultra HD quality processing", included: true },
        { text: "Bulk processing (50 at once)", included: true },
        { text: "Unlimited image history", included: true },
      ],
    },
  ];

  const handleSubscription = async (planId: string) => {
    if (!user) {
      navigate("/auth?redirect=pricing");
      return;
    }

    setIsUpdating(true);
    
    try {
      // Normally this would integrate with a payment processor
      // For demo purposes, we'll just update the user's plan
      const response = await apiRequest("POST", "/api/update-subscription", { plan: planId });
      const updatedUser = await response.json();
      
      // Update the user in the cache
      queryClient.setQueryData(["/api/user"], updatedUser);
      
      toast({
        title: "Subscription updated",
        description: `You are now on the ${planId} plan!`,
      });
    } catch (error) {
      toast({
        title: "Failed to update subscription",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const buttonText = (plan: PricingPlan) => {
    if (user?.subscriptionPlan === plan.id) {
      return "Current Plan";
    }
    
    if (plan.id === "free") {
      return "Get Started";
    }
    
    return "Coming Soon";
  };

  return (
    <section id="pricing" className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-60">
        <div className="absolute top-[10%] left-[5%] w-20 h-20 bg-purple-500/20 rounded-full animate-float-slow"></div>
        <div className="absolute top-[40%] right-[10%] w-32 h-32 bg-indigo-500/10 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-[15%] left-[20%] w-24 h-24 bg-blue-500/15 rounded-full animate-float-fast"></div>
        <div className="absolute top-[60%] right-[25%] w-16 h-16 bg-purple-400/20 rounded-full animate-float-slow"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Choose the plan that suits your needs. All plans include high-quality background removal.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 inline-block"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Online payments coming soon!
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className={`bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border ${
                plan.popular 
                  ? 'border-primary z-10 md:scale-105' 
                  : 'border-gray-200 dark:border-gray-700'
              } relative`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-1 text-xs font-medium">
                  MOST POPULAR
                </div>
              )}
              
              <div className={`p-6 ${plan.popular ? 'pt-8' : ''}`}>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                <p className="text-4xl font-bold mb-6">
                  {plan.price}
                  <span className="text-lg text-gray-600 dark:text-gray-400 font-normal">/month</span>
                </p>
                
                <ul className="mb-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      )}
                      <span className={feature.included ? '' : 'text-gray-500 dark:text-gray-400'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full relative overflow-hidden group"
                  disabled={plan.id !== "free" || Boolean(user?.subscriptionPlan === plan.id)}
                  onClick={() => plan.id === "free" && handleSubscription(plan.id)}
                >
                  <span className="relative z-10">{buttonText(plan)}</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  {plan.id !== "free" && (
                    <span className="absolute top-0 right-0 mt-2 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
