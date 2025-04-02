import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import UploadSection from "@/components/upload-section";
// Define a temporary user interface matching what we expect from the API
interface UserData {
  id: number;
  username: string;
  email: string;
  processingCount: number;
  subscriptionPlan: string;
  createdAt: string;
}

const Dashboard = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: user, isLoading, error } = useQuery<UserData>({
    queryKey: ['/api/auth/me'],
    retry: false,
  });

  const { data: userImages } = useQuery<any[]>({
    queryKey: ['/api/user-images'],
    enabled: !!user,
  });

  useEffect(() => {
    if (!isLoading && !user && !error) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the dashboard",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, isLoading, error, toast, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="w-full h-full flex items-center justify-center">
            <p>Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user.username}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your account and image processing
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="remove-background">Remove Background</TabsTrigger>
            <TabsTrigger value="history">Image History</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Images Processed</CardTitle>
                  <CardDescription>Total number of images processed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    {userImages?.length || 0}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>Your current plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-medium text-lg">Free Trial</div>
                  <Button className="mt-4" size="sm">
                    Upgrade Plan
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Process New Image
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    View History
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="remove-background">
            <Card>
              <CardHeader>
                <CardTitle>Remove Image Background</CardTitle>
                <CardDescription>
                  Upload and process images with our AI technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UploadSection />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Image Processing History</CardTitle>
                <CardDescription>
                  View and download your previously processed images
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userImages && userImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {userImages.map((image: any) => (
                      <div key={image.id} className="relative rounded-lg overflow-hidden group">
                        <img
                          src={image.url}
                          alt={`Processed ${image.createdAt}`}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button size="sm" variant="secondary">
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      You haven't processed any images yet.
                    </p>
                    <Button className="mt-4">Process Your First Image</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Profile Information</h3>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Username
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          value={user.username}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email
                        </label>
                        <input
                          type="email"
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          value={user.email || ""}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Subscription Details</h3>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        You are currently on the <span className="font-medium">Free Trial</span> plan.
                      </p>
                      <div className="mt-4">
                        <Button>Upgrade Plan</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
