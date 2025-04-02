import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { removeBackground } from "@/lib/remove-background";

const UploadSection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasUsedFreeTrial, setHasUsedFreeTrial] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB",
          variant: "destructive",
        });
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, or WEBP image",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setOriginalImage(URL.createObjectURL(file));
      setResultImage(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB",
          variant: "destructive",
        });
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, or WEBP image",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setOriginalImage(URL.createObjectURL(file));
      setResultImage(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const simulateProgress = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 90) {
        clearInterval(interval);
      }
    }, 300);
    
    return () => clearInterval(interval);
  };

  const processImage = async () => {
    if (!selectedFile || !originalImage) return;
    
    try {
      setProcessing(true);
      setProgress(0);
      
      const cleanup = simulateProgress();
      
      // Check if free trial is used and user is not logged in
      const shouldCheckFreeTrial = !user;
      
      // Process the image
      const result = await removeBackground(selectedFile, shouldCheckFreeTrial);
      
      setProgress(100);
      cleanup();
      
      if (result.usedFreeTrial) {
        setHasUsedFreeTrial(true);
      }
      
      if (result.imageUrl) {
        setResultImage(result.imageUrl);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setResultImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadImage = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = 'backdrop-removed.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <section id="upload-section" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Try it yourself
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
            Upload an image and see the magic happen in seconds. Your first removal is free!
          </p>
        </div>

        {!resultImage ? (
          <div className="mt-12 max-w-lg mx-auto bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md cursor-pointer"
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="space-y-1 text-center">
                  {!originalImage ? (
                    <>
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                          <span>Upload an image</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/jpeg,image/png,image/webp"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </>
                  ) : (
                    <div className="w-full">
                      <img 
                        src={originalImage} 
                        alt="Preview" 
                        className="max-h-64 mx-auto" 
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          resetUpload();
                        }}
                        className="mt-2"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {processing && (
                <div className="w-full mt-6">
                  <Progress value={progress} className="w-full" />
                </div>
              )}
              
              <Button 
                className="w-full mt-4" 
                disabled={!selectedFile || processing}
                onClick={processImage}
              >
                Remove Background
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 max-w-3xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-2">Original Image</h3>
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <img className="w-full h-full object-contain" src={originalImage!} alt="Original" />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-2">Background Removed</h3>
                  <div className="aspect-w-1 aspect-h-1 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <img className="w-full h-full object-contain" src={resultImage} alt="Result" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button variant="outline" onClick={resetUpload}>
                      Try another image
                    </Button>
                    <Button onClick={downloadImage}>
                      Download image
                    </Button>
                  </div>
                </div>
              </div>
              
              {hasUsedFreeTrial && !user && (
                <div className="mt-6 bg-primary-50 dark:bg-gray-700 p-4 rounded-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-primary" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-primary-800 dark:text-primary-300">Want unlimited background removals?</h3>
                      <div className="mt-2 text-sm text-primary-700 dark:text-primary-200">
                        <p>
                          You've used your free trial. <a href="#pricing" className="font-medium underline hover:text-primary-600">Sign up for a plan</a> to get unlimited background removals, batch processing, and more.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UploadSection;
