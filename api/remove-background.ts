import { VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';
import { storage } from '../server/storage';
import { v4 as uuidv4 } from 'uuid';
import FormData from 'form-data';
import { promises as fs } from 'fs';
import path from 'path';
import { AuthenticatedRequest } from './types';
import { saveToTemp } from './utils/image-utils';

// Get the user schema to check fields
import { User } from '../shared/schema';

export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    // Check if user is authenticated
    const userId = req.session?.passport?.user;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Get user from storage
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if free trial is used up based on schema fields
    const isFreeUser = user.subscriptionPlan === 'free';
    const processingCount = user.processingCount || 0;
    const freeTrialUsed = user.freeTrialUsed || false;
    const hasUsedFreeTrial = isFreeUser && (processingCount >= 2 || freeTrialUsed);
    
    if (hasUsedFreeTrial) {
      return res.status(403).json({ 
        error: 'Free trial limit reached',
        usedFreeTrial: true 
      });
    }

    // Get image data from request
    if (!req.body || !req.body.image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const imageBase64 = req.body.image.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    
    // Save temporary file
    const tempFilePath = await saveToTemp(imageBuffer);
    
    // Call remove.bg API
    const formData = new FormData();
    formData.append('image_file', await fs.readFile(tempFilePath), {
      filename: path.basename(tempFilePath),
      contentType: 'image/jpeg',
    });

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY || '',
      },
      body: formData,
    });

    // Handle API response
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Remove.bg API error:', errorText);
      return res.status(response.status).json({ 
        error: 'Error removing background', 
        details: errorText 
      });
    }

    // Process successful response
    const outputBuffer = Buffer.from(await response.arrayBuffer());
    const processedId = uuidv4();
    const processedFilePath = path.join('uploads/processed', `${processedId}.png`);
    
    // Save the processed image
    await fs.mkdir('uploads/processed', { recursive: true });
    await fs.writeFile(processedFilePath, outputBuffer);
    
    // Save original image
    const originalId = uuidv4();
    const originalFilePath = path.join('uploads/original', `${originalId}.jpg`);
    await fs.mkdir('uploads/original', { recursive: true });
    await fs.writeFile(originalFilePath, imageBuffer);
    
    // Create database record - make sure fields match your schema
    const image = await storage.saveImage({
      userId,
      originalUrl: `/uploads/original/${originalId}.jpg`,
      processedUrl: `/uploads/processed/${processedId}.png`,
      createdAt: new Date(),
    });
    
    // Update user processing count
    await storage.incrementProcessingCount(userId);
    
    // Return the processed image
    return res.status(200).json({
      id: image.id,
      originalUrl: `/uploads/original/${originalId}.jpg`,
      processedUrl: `/uploads/processed/${processedId}.png`,
      usedFreeTrial: isFreeUser && processingCount === 1, // Will be at limit after this
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}