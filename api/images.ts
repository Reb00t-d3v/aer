import { VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { AuthenticatedRequest } from './types';

export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  // Check if user is authenticated
  const userId = req.session?.passport?.user;
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Get user images
    const images = await storage.getUserImages(userId);
    
    // Transform paths to URLs
    const transformedImages = images.map(image => ({
      id: image.id,
      createdAt: image.createdAt,
      originalUrl: `/api/image?path=${encodeURIComponent(image.originalPath)}`,
      processedUrl: `/api/image?path=${encodeURIComponent(image.processedPath)}`,
    }));
    
    return res.status(200).json(transformedImages);
  } catch (error) {
    console.error('Error fetching user images:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}