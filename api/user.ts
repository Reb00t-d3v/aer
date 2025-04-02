import { VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { AuthenticatedRequest } from './types';

export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  try {
    const userId = req.session?.passport?.user;
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't send the password hash
    const { password, ...userWithoutPassword } = user;
    
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}