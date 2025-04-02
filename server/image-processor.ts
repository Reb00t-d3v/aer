import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import fetch from 'node-fetch';
import { FormData, Blob } from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the API key is available
const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;
if (!REMOVE_BG_API_KEY) {
  console.warn('Warning: REMOVE_BG_API_KEY not set. Background removal functionality will be limited.');
}

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '../uploads');
const originalDir = path.join(uploadsDir, 'original');
const processedDir = path.join(uploadsDir, 'processed');

async function ensureDirs() {
  try {
    await fs.mkdir(originalDir, { recursive: true });
    await fs.mkdir(processedDir, { recursive: true });
  } catch (error) {
    console.error('Error creating directories:', error);
  }
}

ensureDirs();

import { saveToStorage } from './vercel-storage';
import { isVercel } from './is-vercel';

export async function saveImage(imageBuffer: Buffer): Promise<string> {
  // Use Vercel storage in production, local filesystem in development
  if (isVercel()) {
    const filename = `original-${uuidv4()}.png`;
    return await saveToStorage(imageBuffer, filename);
  } else {
    // Development mode - use filesystem
    const filename = `${uuidv4()}.png`;
    const filePath = path.join(originalDir, filename);
    await fs.writeFile(filePath, imageBuffer);
    return `/uploads/original/${filename}`;
  }
}

export async function removeBackground(originalPath: string): Promise<string> {
  // Generate output path/filename
  const filename = path.basename(originalPath);
  const outputFilename = `processed-${filename.replace('original-', '')}`;
  
  // Get the image buffer - different ways based on environment
  let imageBuffer: Buffer;
  
  if (isVercel() && originalPath.startsWith('/api/images/')) {
    // In Vercel, get from memory/cloud storage
    const imageId = originalPath.replace('/api/images/', '');
    const { getFromStorage } = await import('./vercel-storage');
    const buffer = await getFromStorage(imageId);
    if (!buffer) {
      throw new Error('Image not found in storage');
    }
    imageBuffer = buffer;
  } else {
    // In development, read from filesystem
    const fullOriginalPath = path.join(__dirname, '..', originalPath);
    imageBuffer = await fs.readFile(fullOriginalPath);
  }
  
  // Prepare output path - only used in development
  const outputPath = path.join(processedDir, outputFilename);
  
  try {
    if (REMOVE_BG_API_KEY) {
      // Use remove.bg API for professional background removal
      const formData = new FormData();
      
      // Add image file to form data
      formData.append('image_file', new Blob([imageBuffer]), 'image.png');
      
      // Configure how the image should be processed
      formData.append('size', 'auto');
      formData.append('format', 'png');
      formData.append('bg_color', ''); // transparent background
      
      console.log('Sending request to remove.bg API...');
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': REMOVE_BG_API_KEY
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Remove.bg API error response:', errorBody);
        
        // Check if we've hit API limits
        if (response.status === 402) {
          throw new Error('API usage limit reached. Please try again later.');
        } else {
          throw new Error(`Remove.bg API error: ${response.status} ${response.statusText}`);
        }
      }
      
      const processedImageBuffer = await response.buffer();
      
      console.log('Successfully processed image with remove.bg API');
      
      if (isVercel()) {
        // In Vercel, save to cloud storage
        const filename = `processed-${uuidv4()}.png`;
        return await saveToStorage(processedImageBuffer, filename);
      } else {
        // In development, save to filesystem
        await fs.writeFile(outputPath, processedImageBuffer);
        return `/uploads/processed/${outputFilename}`;
      }
    } else {
      // Fallback to simple circle mask if API key not available
      console.log('Using fallback background removal method');
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();
      
      const width = metadata.width || 500;
      const height = metadata.height || 500;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2;
      
      // Create SVG circle mask
      const circleSvg = Buffer.from(`
        <svg width="${width}" height="${height}">
          <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="white" />
        </svg>
      `);
      
      // Apply the mask and get buffer
      const processedImageBuffer = await image
        .composite([
          {
            input: circleSvg,
            blend: 'dest-in',
          },
        ])
        .png()
        .toBuffer();
        
      if (isVercel()) {
        // In Vercel, save to cloud storage
        const filename = `processed-${uuidv4()}.png`;
        return await saveToStorage(processedImageBuffer, filename);
      } else {
        // In development, save to filesystem
        await fs.writeFile(outputPath, processedImageBuffer);
        return `/uploads/processed/${outputFilename}`;
      }
    }
  } catch (error) {
    console.error('Error removing background:', error);
    
    // If the API call fails, fall back to the simple method
    try {
      console.log('Falling back to simple background removal method');
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();
      
      const width = metadata.width || 500;
      const height = metadata.height || 500;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2;
      
      // Create SVG circle mask
      const circleSvg = Buffer.from(`
        <svg width="${width}" height="${height}">
          <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="white" />
        </svg>
      `);
      
      // Apply the mask and get buffer
      const processedImageBuffer = await image
        .composite([
          {
            input: circleSvg,
            blend: 'dest-in',
          },
        ])
        .png()
        .toBuffer();
        
      if (isVercel()) {
        // In Vercel, save to cloud storage
        const filename = `processed-${uuidv4()}.png`;
        return await saveToStorage(processedImageBuffer, filename);
      } else {
        // In development, save to filesystem
        await fs.writeFile(outputPath, processedImageBuffer);
        return `/uploads/processed/${outputFilename}`;
      }
    } catch (fallbackError) {
      console.error('Fallback background removal also failed:', fallbackError);
      throw new Error('Background removal failed');
    }
  }
}

export async function processImage(imageBuffer: Buffer): Promise<{
  originalUrl: string;
  processedUrl: string;
}> {
  const originalUrl = await saveImage(imageBuffer);
  const processedUrl = await removeBackground(originalUrl);
  
  return {
    originalUrl,
    processedUrl
  };
}
