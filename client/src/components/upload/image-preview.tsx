import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImagePreviewProps {
  originalImageUrl: string | null;
  processedImageUrl: string | null;
  isProcessing: boolean;
  onProcess: () => void;
  onReset: () => void;
}

export function ImagePreview({
  originalImageUrl,
  processedImageUrl,
  isProcessing,
  onProcess,
  onReset,
}: ImagePreviewProps) {
  const [activeTab, setActiveTab] = useState<"original" | "processed">("original");
  const { toast } = useToast();
  
  const handleDownload = async () => {
    if (!processedImageUrl) return;
    
    try {
      const response = await fetch(processedImageUrl);
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = url;
      a.download = `removebg-${Date.now()}.png`;
      document.body.appendChild(a);
      
      // Trigger download
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: "Your image has been downloaded.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "There was a problem downloading your image. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 aspect-video flex items-center justify-center">
            {activeTab === "original" && originalImageUrl && (
              <img 
                src={originalImageUrl} 
                alt="Original image" 
                className="max-w-full max-h-full object-contain"
              />
            )}
            
            {activeTab === "processed" && processedImageUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <div 
                  className="absolute inset-0 bg-gray-200 dark:bg-gray-700 opacity-50" 
                  style={{ 
                    backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path d="M1,0H0V1H2V2H1" fill="rgba(200,200,200,0.5)"/></svg>')`,
                    backgroundSize: '15px 15px'
                  }}
                />
                <img 
                  src={processedImageUrl} 
                  alt="Processed image" 
                  className="max-w-full max-h-full object-contain relative z-10" 
                  style={{ mixBlendMode: "multiply" }}
                />
              </div>
            ) : (
              activeTab === "processed" && (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  {isProcessing ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin mb-2" />
                      <p>Processing your image...</p>
                    </div>
                  ) : (
                    <p>Process your image to see the result</p>
                  )}
                </div>
              )
            )}
            
            <div className="absolute top-2 left-2 bg-gray-900 bg-opacity-60 text-white text-xs py-1 px-2 rounded">
              {activeTab === "original" ? "Original" : "Background Removed"}
            </div>
          </div>
          
          <div className="flex mt-4 border-b border-gray-200 dark:border-gray-700">
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === "original"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab("original")}
            >
              Original
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === "processed"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab("processed")}
              disabled={!processedImageUrl && !isProcessing}
            >
              Processed
            </button>
          </div>
        </div>
        
        <div className="w-full md:w-1/3 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Image Controls
          </h3>
          
          {!processedImageUrl ? (
            <Button
              onClick={onProcess}
              disabled={isProcessing}
              className="mb-3"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Remove Background"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleDownload}
              className="mb-3"
              variant="default"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
          
          <Button
            onClick={onReset}
            variant="outline"
            className="mb-3"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Upload New Image
          </Button>
          
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-900 rounded text-sm text-gray-600 dark:text-gray-400">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Tips:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Best results with clear subject-background contrast</li>
              <li>Good lighting improves accuracy</li>
              <li>Higher resolution images yield better results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
