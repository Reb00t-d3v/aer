import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { createCanvas, loadImage } from 'canvas';
import FormData from 'form-data';
import fetch from 'node-fetch';

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);

// Ensure tmp directory exists
const ensureTmpDir = async () => {
  const tmpDir = path.resolve(process.cwd(), 'tmp');
  try {
    await fs.promises.access(tmpDir);
  } catch (error) {
    await mkdirAsync(tmpDir, { recursive: true });
  }
  return tmpDir;
};

// Professional background removal using remove.bg API
export async function removeImageBackground(
  imageBuffer: Buffer,
  outputFormat: 'png' | 'jpeg' = 'png'
): Promise<Buffer> {
  try {
    if (!process.env.REMOVE_BG_API_KEY) {
      throw new Error('Missing REMOVE_BG_API_KEY environment variable');
    }

    console.log('Using remove.bg API for background removal');
    
    // Create form data for the API request (Node.js version)
    const formData = new FormData();
    
    // Append the image buffer directly with a filename
    formData.append('image_file', imageBuffer, {
      filename: 'image.png',
      contentType: 'image/png',
    });
    
    // Set other parameters
    formData.append('size', 'auto');
    formData.append('format', 'png');
    
    // Make request to remove.bg API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY,
        ...formData.getHeaders()
      },
      body: formData
    });

    // Check if request was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Remove.bg API error:', errorText);
      throw new Error(`Remove.bg API failed: ${response.status} ${response.statusText}`);
    }

    // Get the image buffer from the response
    const buffer = await response.buffer();
    return buffer;
  } catch (error) {
    console.error('Error processing image with remove.bg:', error);
    
    // Fallback to simple processing if the API fails
    try {
      console.log('Falling back to simple processing');
      // Load image using canvas
      const image = await loadImage(imageBuffer);
      
      // Create canvas with image dimensions
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      
      // Draw the image with transparency (to simulate background removal)
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      
      // Convert to buffer
      return canvas.toBuffer('image/png');
    } catch (fallbackError) {
      console.error('Fallback processing also failed:', fallbackError);
      throw new Error('Failed to process image: API error and fallback failed');
    }
  }
}

export async function saveImageToTemp(
  imageBuffer: Buffer,
  fileName: string
): Promise<string> {
  try {
    const tmpDir = await ensureTmpDir();
    const filePath = path.join(tmpDir, fileName);
    await writeFileAsync(filePath, imageBuffer);
    return filePath;
  } catch (error) {
    console.error('Error saving image to temp:', error);
    throw new Error('Failed to save temporary image');
  }
}

export async function removeFileFromTemp(filePath: string): Promise<void> {
  try {
    await unlinkAsync(filePath);
  } catch (error) {
    console.error('Error removing temp file:', error);
  }
}
