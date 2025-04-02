import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { uploadAndProcessImage } from '@/lib/imageProcessing';
import { checkFreeTrial } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Loader2, X, Download, Upload, Plus } from 'lucide-react';

interface ToolProps {
  user: any | null;
}

const Tool = ({ user }: ToolProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<{original: string, processed: string, id: number | null} | null>(null);
  const [hasFreeTrial, setHasFreeTrial] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      // Check if the visitor has free trial available
      const checkFreeTrialStatus = async () => {
        const freeTrialAvailable = await checkFreeTrial();
        setHasFreeTrial(freeTrialAvailable);
      };
      
      checkFreeTrialStatus();
    }
  }, [user]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSelectedFile(e.target.files[0]);
    }
  };

  const handleSelectedFile = (file: File) => {
    // Validate file type
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG or PNG image.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 20MB.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleProcessImage = async () => {
    if (!selectedFile) return;
    
    try {
      setLoading(true);
      setStep(2);
      
      const result = await uploadAndProcessImage(selectedFile);
      
      setProcessedImage(result);
      setStep(3);
    } catch (error) {
      let errorMessage = "Failed to process image";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      // If user needs to sign up (403 error)
      if (errorMessage.includes("Free trial already used") || 
          errorMessage.includes("limit reached")) {
        toast({
          title: "Subscription Required",
          description: "Please sign up or upgrade your plan to continue.",
          variant: "default"
        });
      }
      
      setStep(1);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!processedImage) return;
    
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = processedImage.processed;
    link.download = 'removed-background.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const resetTool = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedImage(null);
    setStep(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section id="tool" className="py-16 bg-purple-50 dark:bg-gray-800/30 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-montserrat text-gray-900 dark:text-white">Remove Background Now</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            {!user && hasFreeTrial 
              ? "Try it once for free. No registration required." 
              : user 
                ? `Welcome back, ${user.username}! You're ready to process images.` 
                : "Sign up to remove backgrounds from your images."}
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-6 md:p-8">
            {/* Step indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center relative">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300'} flex items-center justify-center font-bold text-lg`}>1</div>
                  <span className={`text-sm mt-2 font-medium ${step >= 1 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Upload</span>
                </div>
                {/* Line */}
                <div className={`w-16 md:w-24 border-t-2 ${step >= 2 ? 'border-purple-300' : 'border-gray-200 dark:border-gray-700'} mx-3 md:mx-6`}></div>
                {/* Step 2 */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300'} flex items-center justify-center font-bold text-lg`}>2</div>
                  <span className={`text-sm mt-2 font-medium ${step >= 2 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Remove</span>
                </div>
                {/* Line */}
                <div className={`w-16 md:w-24 border-t-2 ${step >= 3 ? 'border-purple-300' : 'border-gray-200 dark:border-gray-700'} mx-3 md:mx-6`}></div>
                {/* Step 3 */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full ${step >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300'} flex items-center justify-center font-bold text-lg`}>3</div>
                  <span className={`text-sm mt-2 font-medium ${step >= 3 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Download</span>
                </div>
              </div>
            </div>

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Upload area */}
                <div 
                  className={`border-2 border-dashed ${dragActive ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10' : 'border-gray-300 dark:border-gray-700'} rounded-lg p-8 text-center`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {previewUrl ? (
                    <div className="relative max-w-md mx-auto">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-64 rounded-lg mx-auto object-contain"
                      />
                      <button
                        onClick={resetTool}
                        className="absolute top-2 right-2 bg-gray-900/50 hover:bg-gray-900/70 text-white rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                      <Button 
                        className="mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                        onClick={handleProcessImage}
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        Process Image
                      </Button>
                    </div>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Upload an image</h3>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        PNG, JPG up to 20MB
                      </p>
                      <div className="mt-6">
                        <Button 
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          Select a file
                        </Button>
                        <input 
                          id="file-upload" 
                          type="file" 
                          className="sr-only" 
                          accept="image/png,image/jpeg"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                          or drag and drop
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
            
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10"
              >
                <Loader2 className="h-10 w-10 mx-auto mb-4 animate-spin text-purple-600" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Processing your image...</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Our AI is working its magic. This may take a few seconds.
                </p>
              </motion.div>
            )}
            
            {step === 3 && processedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Background Removed!</h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Original</p>
                    <img 
                      src={processedImage.original} 
                      alt="Original" 
                      className="max-h-52 mx-auto object-contain rounded-lg"
                    />
                  </div>
                  <div className="p-2 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Processed</p>
                    <div className="bg-gradient-to-r from-gray-200 to-white dark:from-gray-700 dark:to-gray-800 rounded-lg h-[200px] flex items-center justify-center">
                      <img 
                        src={processedImage.processed} 
                        alt="Processed" 
                        className="max-h-52 mx-auto object-contain"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={resetTool}
                  >
                    Process another image
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PNG
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Terms and privacy notice */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center">
              By uploading an image, you agree to our 
              <Link href="#" className="text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 ml-1">Terms of Service</Link> and 
              <Link href="#" className="text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 ml-1">Privacy Policy</Link>.
            </p>
          </CardContent>
        </Card>

        {/* Free trial counter or subscription info */}
        <div className="mt-8 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            <Plus className="h-5 w-5 text-purple-600" />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              {user ? (
                <span>
                  <span className="font-medium">
                    Your plan: {user.subscriptionTier === 'free' ? 'Free' : user.subscriptionTier === 'basic' ? 'Basic' : 'Pro'}
                  </span> 
                  {user.subscriptionTier === 'free' ? (
                    <> - {user.imagesProcessed}/1 images used</>
                  ) : user.subscriptionTier === 'basic' ? (
                    <> - {user.imagesProcessed}/100 images used</>
                  ) : (
                    <> - Unlimited images</>
                  )}
                </span>
              ) : hasFreeTrial ? (
                <span><span className="font-medium">Free Trial:</span> 1 image remaining</span>
              ) : (
                <span><span className="font-medium">Free Trial:</span> No free trials remaining</span>
              )}
            </span>
          </div>
          {(!user || user.subscriptionTier !== 'pro') && (
            <Link href={user ? "/pricing" : "/register"} className="text-sm text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 font-medium">
              {user ? "Upgrade plan" : "Sign up for more"}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Tool;
