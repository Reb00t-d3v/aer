import { VercelRequest, VercelResponse } from '@vercel/node';
import { promises as fs } from 'fs';
import path from 'path';
import { isVercel } from '../server/is-vercel';
import { serveImage } from '../server/vercel-storage';
import { ErrorResponse } from './types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const imagePath = req.query.path as string;
    
    if (!imagePath) {
      return res.status(400).json({ error: 'No image path provided' });
    }
    
    // Determine content type based on file extension
    const ext = path.extname(imagePath).toLowerCase();
    const contentType = ext === '.png' 
      ? 'image/png' 
      : ext === '.jpg' || ext === '.jpeg'
        ? 'image/jpeg'
        : 'application/octet-stream';
    
    // Serve file differently based on environment
    if (isVercel()) {
      // Use Vercel blob storage in production
      const imageResult = await serveImage(imagePath);
      
      if (!imageResult.buffer) {
        return res.status(404).json({ error: 'Image not found' });
      }
      
      res.setHeader('Content-Type', imageResult.contentType);
      return res.send(imageResult.buffer);
    } else {
      // Serve from filesystem in development
      try {
        const imageBuffer = await fs.readFile(imagePath);
        res.setHeader('Content-Type', contentType);
        return res.send(imageBuffer);
      } catch (error) {
        console.error('Error reading image file:', error);
        return res.status(404).json({ error: 'Image not found' });
      }
    }
  } catch (error) {
    console.error('Error serving image:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}