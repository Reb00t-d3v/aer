import { VercelRequest, VercelResponse } from '@vercel/node';
import { isVercel } from '../server/is-vercel';
import { setupAuth } from '../server/auth';
import express from 'express';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import { registerRoutes } from '../server/routes';

// Create Express server
const app = express();

// Middleware
app.use(cors());
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: true, limit: '50mb' }));

// Setup authentication
setupAuth(app);

// Register API routes
registerRoutes(app);

// Helper to run the API
const runApi = async (req: VercelRequest, res: VercelResponse) => {
  // Forward the request to our express app
  return new Promise((resolve) => {
    app(req, res, () => {
      resolve(undefined);
    });
  });
};

// Default handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return runApi(req, res);
}