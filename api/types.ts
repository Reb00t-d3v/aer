import { VercelRequest } from '@vercel/node';
import { User, Image } from '../shared/schema';

// Extend VercelRequest to include session management and auth
export interface AuthenticatedRequest extends VercelRequest {
  user?: User;
  login?: (user: any, callback: (err: any) => void) => void;
  logout?: (callback: (err: any) => void) => void;
  session?: {
    passport?: {
      user: number;
    };
  };
}

// Response types for API endpoints
export interface AuthResponse {
  id: number;
  username: string;
  email?: string;
  processingCount: number;
  subscriptionPlan: string;
  freeTrialUsed: boolean;
}

export interface ErrorResponse {
  error: string;
  details?: any;
}

export interface ImageProcessingResponse {
  id: number;
  originalUrl: string;
  processedUrl: string;
  usedFreeTrial: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
}