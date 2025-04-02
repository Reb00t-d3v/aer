import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import multer from "multer";
import path from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { processImage } from "./image-processor";
import { isVercel } from "./is-vercel";
import { serveImage } from "./vercel-storage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Create uploads directory if it doesn't exist (only in dev environment)
if (!isVercel()) {
  const uploadsDir = path.join(__dirname, '../uploads');
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (error) {
    console.error('Error creating uploads directory:', error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Conditionally serve uploaded files based on environment
  if (!isVercel()) {
    // In development, serve files from the filesystem
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
  } else {
    // In Vercel, serve images from cloud storage
    app.get('/api/images/:id', async (req, res) => {
      try {
        const { buffer, contentType } = await serveImage(req.params.id);
        if (!buffer) {
          return res.status(404).send("Image not found");
        }
        
        res.setHeader("Content-Type", contentType);
        res.send(buffer);
      } catch (error) {
        console.error("Error serving image:", error);
        res.status(500).send("Error serving image");
      }
    });
  }

  // Background removal API endpoint
  app.post("/api/remove-background", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ error: "Only JPG, PNG, and WEBP files are allowed" });
      }

      let userId = null;
      if (req.isAuthenticated()) {
        userId = req.user?.id;
      }

      // Process free trial usage
      if (!req.isAuthenticated()) {
        // Use IP address to track anonymous usage
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        
        // In a real application, we would check a database for IP-based usage
        // For now, we'll allow unauthenticated usage without restriction
      } else {
        // For authenticated users, track their usage
        const user = await storage.getUser(userId as number);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Check subscription plan limits
        if (user.subscriptionPlan === 'free') {
          // Free users can only process 2 images
          if (user.processingCount >= 2) {
            return res.status(403).json({ 
              error: "You've reached your limit of 2 free images. Please upgrade to a premium plan.",
              needsUpgrade: true
            });
          }
        } else if (user.subscriptionPlan === 'premium') {
          // Premium users have a limit of 100 images per month
          if (user.processingCount >= 100) {
            return res.status(403).json({ 
              error: "You've reached your monthly limit of 100 images. Please upgrade to Business plan for unlimited processing.",
              needsUpgrade: true
            });
          }
        }
        // Business plan has unlimited access
        
        // Increment user's processing count
        await storage.incrementProcessingCount(userId as number);
      }

      // Process the image
      const result = await processImage(req.file.buffer);

      // Save image record if user is authenticated
      if (userId) {
        await storage.saveImage({
          userId: userId,
          originalUrl: result.originalUrl,
          processedUrl: result.processedUrl
        });
      }

      res.json({
        originalUrl: result.originalUrl,
        processedUrl: result.processedUrl
      });
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).json({ error: "Image processing failed" });
    }
  });

  // Get user's image history
  app.get("/api/user-images", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      const images = await storage.getUserImages(req.user!.id);
      res.json(images);
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ error: "Failed to fetch image history" });
    }
  });

  // Update user subscription plan
  app.post("/api/update-subscription", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      const { plan } = req.body;
      if (!plan || !['free', 'premium', 'business'].includes(plan)) {
        return res.status(400).json({ error: "Invalid subscription plan" });
      }

      const updatedUser = await storage.updateUser(req.user!.id, { subscriptionPlan: plan });
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error updating subscription:', error);
      res.status(500).json({ error: "Failed to update subscription" });
    }
  });

  // Catch-all route for client-side routing (must be at the end of all routes)
  if (isVercel()) {
    // Create a path to the built SPA index file
    const indexPath = path.join(__dirname, '../public/index.html');
    
    // Set up a catch-all route for all non-API routes
    app.use('*', async (req, res, next) => {
      try {
        // Skip API routes
        if (req.originalUrl.startsWith('/api')) {
          return next();
        }
        
        // Check if the file exists in the public directory
        const publicPath = path.join(__dirname, '../public', req.originalUrl);
        if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
          return res.sendFile(publicPath);
        }
        
        // For all other requests, serve the SPA index file
        res.sendFile(indexPath);
      } catch (error) {
        console.error('Error serving index.html:', error);
        next(error);
      }
    });
  }

  const httpServer = createServer(app);

  return httpServer;
}

// Add Express import since it's used in the middleware
import express from 'express';
