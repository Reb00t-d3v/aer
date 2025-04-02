import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ImagePreview } from "./image-preview";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { isValidImageFile, formatFileSize, isAuthenticated } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface ImageUploadProps {
  onOpenAuthModal: () => void;
}

export function ImageUpload({ onOpenAuthModal }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileSelection = (selectedFile: File) => {
    if (!isValidImageFile(selectedFile)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG or JPEG image.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${formatFileSize(MAX_FILE_SIZE)}. Your file is ${formatFileSize(selectedFile.size)}.`,
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
    setOriginalImageUrl(URL.createObjectURL(selectedFile));
    setProcessedImageUrl(null);
  };
  
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const processImage = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append("image", file);
    
    setIsUploading(true);
    
    try {
      const response = await fetch("/api/images/process", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to process image");
      }
      
      setProcessedImageUrl(data.processedImageUrl);
      queryClient.invalidateQueries({ queryKey: ["/api/images"] });
      
      // Check if user is not authenticated and prompt them to sign up
      if (!isAuthenticated() && data.freeTrialUsed) {
        toast({
          title: "Free trial used",
          description: "Sign up to process more images and unlock all features!",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error processing image:", error);
      
      if (error instanceof Error && error.message === "Unauthorized") {
        toast({
          title: "Free trial used",
          description: "Please sign up to continue using our service.",
          action: (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onOpenAuthModal}
            >
              Sign up
            </Button>
          ),
        });
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to process image. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  const resetUpload = () => {
    setFile(null);
    setOriginalImageUrl(null);
    setProcessedImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
    <div className="w-full">
      {!file ? (
        <div 
          className={`image-upload-area border-2 border-dashed rounded-lg p-8 sm:p-12 flex flex-col items-center justify-center bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all animate-fade-in ${
            isDragging ? "border-primary" : "border-gray-300 dark:border-gray-700"
          }`}
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-center">
            <Upload className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Upload an image</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Drag and drop your file here, or click to browse
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              PNG, JPG, JPEG (max. 10MB)
            </p>
          </div>
          <Button
            onClick={handleFileButtonClick}
            className="mt-6"
          >
            Select File
          </Button>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/png, image/jpeg, image/jpg" 
            onChange={handleFileInputChange}
          />
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            1 free image for unregistered users. <Button variant="link" className="p-0 h-auto text-xs" onClick={onOpenAuthModal}>Sign up</Button> for unlimited images.
          </p>
        </div>
      ) : (
        <ImagePreview
          originalImageUrl={originalImageUrl}
          processedImageUrl={processedImageUrl}
          isProcessing={isUploading}
          onProcess={processImage}
          onReset={resetUpload}
        />
      )}
    </div>
  );
}
