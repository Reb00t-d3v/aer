import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Image as ImageIcon, User, Settings, CreditCard, LogOut, ChevronRight } from "lucide-react";
import { Image as ImageType } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("account");

  const { data: images, isLoading: imagesLoading } = useQuery<ImageType[]>({
    queryKey: ["/api/images"],
    refetchOnWindowFocus: false,
  });

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
    });
  };

  // Get plan tier color
  const getPlanColor = () => {
    if (!user) return "bg-gray-500";
    
    switch (user.subscriptionPlan) {
      case "premium": return "bg-amber-500";
      case "business": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  // Calculate image usage percentage
  const calculateUsagePercentage = () => {
    if (!user) return 0;
    
    if (user.subscriptionPlan === "free") {
      return Math.min(100, (user.processingCount / 2) * 100);
    } else if (user.subscriptionPlan === "premium") {
      return Math.min(100, (user.processingCount / 100) * 100);
    }
    
    return 0; // business plan has unlimited
  };

  const getRemainingImages = () => {
    if (!user) return "0";
    
    if (user.subscriptionPlan === "free") {
      return `${Math.max(0, 2 - user.processingCount)} / 2`;
    } else if (user.subscriptionPlan === "premium") {
      return `${Math.max(0, 100 - user.processingCount)} / 100`;
    }
    
    return "Unlimited"; // business plan
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{user?.username}</CardTitle>
                      <CardDescription>{user?.email || "No email provided"}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-1">
                    <button 
                      onClick={() => setActiveTab("account")}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                        activeTab === "account" 
                          ? "bg-primary text-white" 
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center">
                        <User className="mr-3 h-5 w-5" />
                        <span>Account</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab("images")}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                        activeTab === "images" 
                          ? "bg-primary text-white" 
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center">
                        <ImageIcon className="mr-3 h-5 w-5" />
                        <span>My Images</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab("billing")}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                        activeTab === "billing" 
                          ? "bg-primary text-white" 
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center">
                        <CreditCard className="mr-3 h-5 w-5" />
                        <span>Billing</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab("settings")}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                        activeTab === "settings" 
                          ? "bg-primary text-white" 
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center">
                        <Settings className="mr-3 h-5 w-5" />
                        <span>Settings</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    
                    <button 
                      onClick={() => logoutMutation.mutate()}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <div className="flex items-center">
                        <LogOut className="mr-3 h-5 w-5" />
                        <span>Logout</span>
                      </div>
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>
            
            {/* Main content area */}
            <div className="md:w-3/4">
              {activeTab === "account" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>
                        Manage your account details and personal information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</span>
                          <span className="font-medium">{user?.username}</span>
                        </div>
                        
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</span>
                          <span className="font-medium">{user?.email || "No email provided"}</span>
                        </div>
                        
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</span>
                          <span className="font-medium">March 31, 2025</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscription Plan</CardTitle>
                      <CardDescription>
                        Your current plan and usage
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Badge className={`px-2 py-1 text-white ${getPlanColor()}`}>
                              {user?.subscriptionPlan ? `${user.subscriptionPlan.charAt(0).toUpperCase()}${user.subscriptionPlan.slice(1)} Plan` : 'Free Plan'}
                            </Badge>
                          </div>
                          
                          {user?.subscriptionPlan !== "business" && (
                            <Link href="/#pricing">
                              <Button size="sm">Upgrade</Button>
                            </Link>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Images Used: {user?.processingCount}</span>
                            <span>{getRemainingImages()} remaining</span>
                          </div>
                          <Progress value={calculateUsagePercentage()} className="h-2" />
                        </div>
                        
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user?.subscriptionPlan === "free" ? (
                            <p>Your free plan allows up to 2 image removals. Upgrade to process more images.</p>
                          ) : user?.subscriptionPlan === "premium" ? (
                            <p>Your premium plan allows up to 100 image removals per month.</p>
                          ) : (
                            <p>Your business plan includes unlimited image processing.</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeTab === "images" && (
                <Card>
                  <CardHeader>
                    <CardTitle>My Processed Images</CardTitle>
                    <CardDescription>
                      View and download your processed images
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {imagesLoading ? (
                      <div className="py-8 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : !images || images.length === 0 ? (
                      <div className="py-8 text-center">
                        <ImageIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium mb-1">No images yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
                          You haven't processed any images yet. Start by removing backgrounds from your images.
                        </p>
                        <Link href="/dashboard">
                          <Button>Process an Image</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {images.map((image) => (
                          <div key={image.id} className="border dark:border-gray-700 rounded-lg overflow-hidden group">
                            <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                              <div className="absolute inset-0" style={{
                                backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="%23d1d5db"><rect width="8" height="8" /><rect width="8" height="8" x="8" y="8" /></svg>')`,
                                backgroundSize: '16px 16px'
                              }}></div>
                              <img 
                                src={image?.processedUrl ?? ''} 
                                alt={`Processed image ${image?.id}`}
                                className="w-full h-full object-contain"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <a 
                                  href={image?.processedUrl ?? ''}
                                  download={`removo-image-${image?.id}.png`}
                                  className="bg-white text-black rounded-full p-2"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                  </svg>
                                </a>
                              </div>
                            </div>
                            <div className="p-2 text-xs text-gray-500">
                              {formatDate(image?.createdAt?.toString() ?? new Date().toString())}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "billing" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Billing & Payments</CardTitle>
                    <CardDescription>
                      Manage your subscription and payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium mb-2">Current Plan</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge className={`px-2 py-1 text-white ${getPlanColor()}`}>
                            {user?.subscriptionPlan ? `${user.subscriptionPlan.charAt(0).toUpperCase()}${user.subscriptionPlan.slice(1)} Plan` : 'Free Plan'}
                          </Badge>
                          <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                            {user?.subscriptionPlan === "free" ? "Free" : 
                             user?.subscriptionPlan === "premium" ? "$9.99/month" : 
                             "$19.99/month"}
                          </p>
                        </div>
                        
                        {user?.subscriptionPlan !== "business" && (
                          <Link href="/#pricing">
                            <Button>Upgrade Plan</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800/50 text-yellow-800 dark:text-yellow-200">
                      <h3 className="font-medium flex items-center gap-2 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Payment Methods
                      </h3>
                      <p className="text-sm">
                        Stripe payment integration will be available soon. Please check back later to add your payment method.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "settings" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Theme Preferences</h3>
                        <Tabs defaultValue="dark">
                          <TabsList>
                            <TabsTrigger value="light">Light</TabsTrigger>
                            <TabsTrigger value="dark">Dark</TabsTrigger>
                            <TabsTrigger value="system">System</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium mb-4">Account Actions</h3>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-950">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}