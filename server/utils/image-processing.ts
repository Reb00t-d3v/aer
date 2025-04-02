import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Create upload directories if they don't exist
export function createUploadDirs() {
  const uploadDir = path.join(process.cwd(), "uploads");
  const originalDir = path.join(uploadDir, "original");
  const processedDir = path.join(uploadDir, "processed");
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  
  if (!fs.existsSync(originalDir)) {
    fs.mkdirSync(originalDir);
  }
  
  if (!fs.existsSync(processedDir)) {
    fs.mkdirSync(processedDir);
  }
}

// Process image to remove background
export async function processImage(originalPath: string, filename: string): Promise<string> {
  const outputPath = path.join(process.cwd(), "uploads", "processed", filename);
  
  // For the MVP version, we'll simulate background removal by 
  // applying a simple image manipulation
  try {
    // Check if we can use ImageMagick
    try {
      await execAsync("convert -version");
      
      // Use ImageMagick to remove the background (this is a simple approximation)
      // In a real app, you'd use a more sophisticated algorithm or a dedicated API
      await execAsync(`convert "${originalPath}" -alpha set -channel RGBA -fuzz 20% -fill none -floodfill +0+0 white -flatten "${outputPath}"`);
      
      return path.relative(process.cwd(), outputPath);
    } catch (error) {
      // If ImageMagick is not available, just copy the file
      console.log("ImageMagick not available, copying file instead.");
      fs.copyFileSync(originalPath, outputPath);
      return path.relative(process.cwd(), outputPath);
    }
  } catch (error) {
    console.error("Error processing image:", error);
    // As a fallback, just copy the file
    fs.copyFileSync(originalPath, outputPath);
    return path.relative(process.cwd(), outputPath);
  }
}
