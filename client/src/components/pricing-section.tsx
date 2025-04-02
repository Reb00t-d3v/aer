import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";

const pricingPlans = [
  {
    name: "Basic",
    description: "Perfect for hobbyists and occasional users.",
    price: "$9",
    features: [
      "100 background removals per month",
      "HD image quality",
      "Basic editing tools",
      "Email support"
    ],
    highlight: false
  },
  {
    name: "Professional",
    description: "Ideal for professional creators and small businesses.",
    price: "$29",
    features: [
      "Unlimited background removals",
      "4K image quality",
      "Advanced editing tools",
      "Batch processing (up to 10 images)",
      "Priority email support"
    ],
    highlight: true
  },
  {
    name: "Enterprise",
    description: "For teams and businesses with high volume needs.",
    price: "$99",
    features: [
      "Everything in Professional",
      "Team member accounts (up to 10)",
      "Unlimited batch processing",
      "API access",
      "Dedicated support"
    ],
    highlight: false
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const PricingSection = () => {
  return (
    <section id="pricing" className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
            Simple, transparent pricing
          </h2>
          <p className="mt-5 text-xl text-gray-500 dark:text-gray-300 text-center">
            Choose the plan that's right for you
          </p>
        </div>

        <motion.div 
          className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {pricingPlans.map((plan, index) => (
            <motion.div key={index} variants={item}>
              <Card className={`${plan.highlight ? 'border-primary shadow-md' : ''}`}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-base font-medium text-gray-500 dark:text-gray-400">/mo</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={plan.highlight ? "default" : "outline"}>
                    Get started
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
