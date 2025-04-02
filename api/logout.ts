import { VercelResponse } from '@vercel/node';
import { AuthenticatedRequest } from './types';

export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if user is logged in
  if (!req.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  
  return new Promise<void>((resolve) => {
    if (req.logout) {
      req.logout((err: any) => {
        if (err) {
          console.error('Logout error:', err);
          res.status(500).json({ error: 'Error during logout' });
        } else {
          res.status(200).json({ message: 'Logged out successfully' });
        }
        resolve();
      });
    } else {
      res.status(500).json({ error: 'Logout function not available' });
      resolve();
    }
  });
}