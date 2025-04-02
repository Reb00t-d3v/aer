import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ImageProcessor from "@/components/image-processor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Download, Image, Clock, User, Zap, Crown } from "lucide-react";
import { Image as ImageType, User as UserType } from "@shared/schema";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("process");

  const { data: images, isLoading: imagesLoading } = useQuery<ImageType[]>({
    queryKey: ["/api/images"],
    refetchOnWindowFocus: false,
  });

  // Helper function to get plan badge color
  const getPlanColor = () => {
    switch (user?.subscriptionPlan) {
      case "premium": return "bg-amber-500";
      case "business": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* User welcome banner */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Welcome, {user?.username}!
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className={`px-2 py-1 text-white ${getPlanColor()}`}>
                    {user?.subscriptionPlan.charAt(0).toUpperCase() + user?.subscriptionPlan.slice(1)} Plan
                  </Badge>
                  {user?.subscriptionPlan === "free" && (
                    <Link href="/#pricing">
                      <Button size="sm" variant="outline" className="h-7 gap-1">
                        <Crown className="h-3 w-3" />
                        Upgrade
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 w-full md:w-auto">
                <div className="bg-white dark:bg-gray-800 rounded-md p-4 flex gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/20 p-1">
                      <Image className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Processed</p>
                      <p className="font-medium">{user?.processingCount} images</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/20 p-1">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
                      <p className="font-medium">
                        {user?.subscriptionPlan === "business" 
                          ? "Unlimited" 
                          : user?.subscriptionPlan === "premium" 
                            ? `${Math.max(0, 100 - (user?.processingCount || 0))} / 100`
                            : user?.freeTrialUsed ? "0 / 1" : "1 / 1"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Dashboard Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
              <TabsTrigger value="process">Process Images</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="process">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Remove Image Backgrounds</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                  Upload an image to instantly remove its background using our advanced AI technology.
                </p>
              </div>
              
              <ImageProcessor />
            </TabsContent>
            
            <TabsContent value="history">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Your Processing History</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                  View and download your previously processed images.
                </p>
              </div>
              
              {imagesLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : !images || images.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
                      <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No images yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-4">
                      Once you process images, they will appear here for easy access.
                    </p>
                    <Button onClick={() => setActiveTab("process")}>
                      Process Your First Image
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative group">
                        <div 
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="%23d1d5db"><rect width="8" height="8" /><rect width="8" height="8" x="8" y="8" /></svg>')`,
                            backgroundSize: '16px 16px'
                          }}
                        ></div>
                        <img 
                          src={image.processedUrl} 
                          alt={`Processed image ${image.id}`}
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a 
                            href={image.processedUrl}
                            download={`removo-image-${image.id}.png`}
                            className="bg-white text-black rounded-full p-2"
                          >
                            <Download className="h-5 w-5" />
                          </a>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(image.createdAt.toString())}
                          </p>
                          <a 
                            href={image.processedUrl}
                            download={`removo-image-${image.id}.png`}
                            className="text-primary hover:text-primary-dark text-sm flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" />
                            Download
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
