import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Save an image buffer to a temporary file
 */
export async function saveToTemp(imageBuffer: Buffer): Promise<string> {
  try {
    // Ensure tmp directory exists
    const tmpDir = path.resolve(process.cwd(), 'tmp');
    await fs.mkdir(tmpDir, { recursive: true });
    
    // Generate a unique filename
    const fileName = `temp-${uuidv4()}.jpg`;
    const filePath = path.join(tmpDir, fileName);
    
    // Write the file
    await fs.writeFile(filePath, imageBuffer);
    
    return filePath;
  } catch (error) {
    console.error('Error saving to temp:', error);
    throw new Error('Failed to save temporary file');
  }
}

/**
 * Remove a temporary file
 */
export async function removeFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error removing file:', error);
  }
}