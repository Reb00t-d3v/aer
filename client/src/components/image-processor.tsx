import { useState, useRef, ChangeEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Download, UploadCloud, RefreshCw, Lock, LogIn } from "lucide-react";
import { motion } from "framer-motion";

interface ProcessedImage {
  originalUrl: string;
  processedUrl: string;
}

export default function ImageProcessor() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAndProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadAndProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const uploadAndProcess = async (file: File) => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WEBP file.",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);
    setNeedsUpgrade(false);

    // Create form data
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);

      // Make API request
      const response = await fetch('/api/remove-background', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process image');
      }

      const result = await response.json();
      setProcessedImage(result);
    } catch (error: any) {
      if (error.message.includes("needs")) {
        setNeedsUpgrade(true);
      }
      setErrorMessage(error.message);
      toast({
        title: "Processing failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    // Create a link element to trigger download
    const link = document.createElement('a');
    link.href = processedImage.processedUrl;
    link.download = 'removo-processed-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your processed image download has started."
    });
  };

  const resetProcessor = () => {
    setProcessedImage(null);
    setErrorMessage(null);
    setNeedsUpgrade(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden mb-8 relative">
        {/* Gradient border effect on hover */}
        <div className="absolute -z-10 inset-0 rounded-xl transition-opacity opacity-0 bg-gradient-to-r from-primary/80 via-primary to-primary-light peer-hover:opacity-100"></div>
        
        {/* Transparent login prompt popup */}
        {!user && !processedImage && !errorMessage && (
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-10 flex items-center justify-center p-4"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-6 max-w-sm mx-auto text-center transform transition-all hover:scale-105 duration-300 border border-primary/10">
              <div className="rounded-full bg-primary/5 w-16 h-16 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Lock className="h-8 w-8 text-primary/80" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Sign In Required</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-5">Please sign in to use our background removal tool. You'll get 2 free image processes after login!</p>
              <Link href="/auth" className="block">
                <Button className="w-full bg-primary/90 hover:bg-primary">
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In to Continue
                </Button>
              </Link>
            </div>
          </div>
        )}
        
        <div className="p-8">
          {!isUploading && !processedImage && !errorMessage && (
            <div 
              className={`border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center transition-colors duration-200 ${user ? 'hover:border-primary cursor-pointer' : 'opacity-50'}`}
              onClick={() => user && fileInputRef.current?.click()}
              onDrop={(e) => user && handleDrop(e)}
              onDragOver={(e) => user && handleDragOver(e)}
            >
              <motion.div
                animate={{ y: user ? [0, -8, 0] : 0 }}
                transition={{
                  duration: 2,
                  repeat: user ? Infinity : 0,
                  repeatType: "loop"
                }}
              >
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              </motion.div>
              <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Drag and drop your image here</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">or</p>
              <Button 
                className="mt-2"
                disabled={!user}
                onClick={(e) => {
                  e.stopPropagation();
                  user && fileInputRef.current?.click();
                }}
              >
                Browse Files
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={!user}
              />
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Supports JPG, PNG, WEBP files up to 5MB
              </p>
            </div>
          )}

          {isUploading && (
            <div className="text-center p-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-primary-light bg-opacity-20 h-12 w-12 flex items-center justify-center">
                  <UploadCloud className="h-6 w-6 text-primary" />
                </div>
                <p className="mt-4 text-lg font-medium">Uploading your image...</p>
                <div className="mt-4 w-64">
                  <Progress value={uploadProgress} className="h-2.5" />
                </div>
              </div>
            </div>
          )}

          {processedImage && (
            <div>
              <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Original</p>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden h-48 flex items-center justify-center">
                    <img 
                      src={processedImage.originalUrl} 
                      alt="Original image" 
                      className="max-w-full max-h-full object-contain" 
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Background Removed</p>
                  <div 
                    className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden h-48 flex items-center justify-center" 
                    style={{
                      backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="%23d1d5db"><rect width="8" height="8" /><rect width="8" height="8" x="8" y="8" /></svg>')`,
                      backgroundSize: '16px 16px'
                    }}
                  >
                    <img 
                      src={processedImage.processedUrl} 
                      alt="Processed image" 
                      className="max-w-full max-h-full object-contain" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                <Button onClick={handleDownload}>
                  <Download className="h-5 w-5 mr-2" />
                  Download Image
                </Button>
                <Button variant="outline" onClick={resetProcessor}>
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Try Another Image
                </Button>
              </div>
              
              {!user && (
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    You've used your free removal. <Link href="/auth" className="text-primary hover:text-primary-dark font-medium">Sign up</Link> to get more removals and premium features!
                  </p>
                </div>
              )}

              {user && user.subscriptionPlan === "free" && (
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    You've used {user.processingCount} of 1 free removals. <Link href="/#pricing" className="text-primary hover:text-primary-dark font-medium">Upgrade</Link> to get more removals and premium features!
                  </p>
                </div>
              )}

              {user && user.subscriptionPlan === "premium" && (
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    You've used {user.processingCount} of 100 premium removals this month.
                  </p>
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="text-center p-8">
              <div className="rounded-full bg-red-100 dark:bg-red-900/20 h-12 w-12 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Processing Failed</h3>
              <p className="text-red-600 dark:text-red-400 mb-6">{errorMessage}</p>
              
              {needsUpgrade ? (
                <div className="space-y-4">
                  <p className="text-sm">You need to upgrade your plan to continue using our services.</p>
                  <div className="flex justify-center space-x-4">
                    <Link href="/#pricing">
                      <Button>View Pricing Plans</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <Button variant="outline" onClick={resetProcessor}>
                  Try Again
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
