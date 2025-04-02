import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSubscriptionPlans, updateSubscription } from '@/lib/imageProcessing';
import { useToast } from '@/hooks/use-toast';

interface PricingProps {
  user?: any | null;
}

const Pricing = ({ user }: PricingProps) => {
  const [, setLocation] = useLocation();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { plans } = await getSubscriptionPlans();
        setPlans(plans);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        // Fallback to default plans
        setPlans([
          {
            id: "free",
            name: "Free",
            price: 0,
            features: ["1 free image processing", "Basic resolution", "No account required"],
            imagesPerMonth: 1,
            popular: false,
          },
          {
            id: "basic",
            name: "Basic",
            price: 9.99,
            features: ["100 images per month", "HD resolution (1080p)", "Image history for 30 days", "Basic email support"],
            imagesPerMonth: 100,
            popular: true,
          },
          {
            id: "pro",
            name: "Pro",
            price: 24.99,
            features: ["Unlimited images", "4K resolution", "Batch processing (up to 50)", "Unlimited image history", "Priority support"],
            imagesPerMonth: -1,
            popular: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      setLocation("/register");
      return;
    }

    try {
      await updateSubscription(planId);
      toast({
        title: "Subscription Updated",
        description: `You've successfully upgraded to the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan.`,
      });
    } catch (error) {
      toast({
        title: "Upgrade Failed",
        description: "There was an error updating your subscription. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <section id="pricing" className="py-16 bg-purple-50 dark:bg-gray-800/30 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-montserrat text-gray-900 dark:text-white">Simple, Transparent Pricing</h2>
          <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300 mx-auto">
            Choose the plan that's right for you. All plans come with a 7-day money-back guarantee.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {loading ? (
            // Loading skeleton
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="flex flex-col h-full animate-pulse">
                <CardContent className="p-6 flex-grow flex flex-col">
                  <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6"></div>
                  <div className="space-y-4 mb-6 flex-grow">
                    {Array(4).fill(0).map((_, j) => (
                      <div key={j} className="flex items-start">
                        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full mr-3 mt-0.5"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                      </div>
                    ))}
                  </div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mt-auto"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`
                  ${plan.popular ? 'transform scale-105 z-10' : ''} 
                  flex flex-col
                `}
              >
                <Card 
                  className={`
                    flex flex-col h-full transition-all duration-200 hover:shadow-md hover:-translate-y-1
                    ${plan.popular ? 'shadow-lg border-2 border-purple-400 dark:border-purple-500' : 'shadow-sm border border-gray-200 dark:border-gray-700'}
                  `}
                >
                  <CardContent className={`p-6 flex-grow`}>
                    <div className={`${plan.popular ? 'flex justify-between items-center' : ''}`}>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                      {plan.popular && (
                        <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 hover:bg-purple-100">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {plan.id === 'free' && 'Perfect for trying out our service'}
                      {plan.id === 'basic' && 'Ideal for regular users'}
                      {plan.id === 'pro' && 'For professionals and businesses'}
                    </p>
                    <p className="mt-8">
                      <span className="text-4xl font-extrabold text-gray-900 dark:text-white">${plan.price}</span>
                      <span className="text-gray-500 dark:text-gray-400">/month</span>
                    </p>
                    <ul className="mt-6 space-y-4 flex-grow">
                      {plan.features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start">
                          {(plan.id === 'free' && i === 2) ? (
                            <XCircle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          )}
                          <span className={`ml-3 ${(plan.id === 'free' && i === 2) ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className={`p-6 ${plan.popular ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-800'} rounded-b-xl`}>
                    {user ? (
                      user.subscriptionTier === plan.id ? (
                        <Button
                          className="w-full"
                          variant="outline"
                          disabled
                        >
                          Current Plan
                        </Button>
                      ) : (
                        <Button
                          className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white' : 'border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'}`}
                          variant={plan.popular ? 'default' : 'outline'}
                          onClick={() => handleUpgrade(plan.id)}
                        >
                          {user.subscriptionTier === 'free' || (user.subscriptionTier === 'basic' && plan.id === 'pro') 
                            ? 'Upgrade' 
                            : 'Downgrade'}
                        </Button>
                      )
                    ) : (
                      plan.id === 'free' ? (
                        <Link href="/tool">
                          <Button
                            className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            variant="outline"
                          >
                            Try for free
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/register">
                          <Button
                            className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white' : 'border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'}`}
                            variant={plan.popular ? 'default' : 'outline'}
                          >
                            Get started
                          </Button>
                        </Link>
                      )
                    )}
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-8">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-medium text-gray-900 dark:text-white">Can I cancel my subscription anytime?</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h4 className="font-medium text-gray-900 dark:text-white">What payment methods do you accept?</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  We accept all major credit cards, PayPal, and Apple Pay.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h4 className="font-medium text-gray-900 dark:text-white">How accurate is the background removal?</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Our AI provides professional-grade results for most images. Complex edges like hair and transparent objects may require minor adjustments.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h4 className="font-medium text-gray-900 dark:text-white">Can I use the images commercially?</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Yes, all processed images are yours to use for any purpose, including commercial use.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
