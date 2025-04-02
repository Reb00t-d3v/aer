import { VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertUserSchema } from '../shared/schema';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { AuthenticatedRequest } from './types';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const validation = insertUserSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid input', details: validation.error.format() });
    }
    
    const userData = validation.data;
    const existingUser = await storage.getUserByUsername(userData.username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    
    const hashedPassword = await hashPassword(userData.password);
    const user = await storage.createUser({
      ...userData,
      password: hashedPassword,
      processingCount: 0,
      subscriptionPlan: 'free',
      freeTrialUsed: false,
    });
    
    if (req.login) {
      req.login(user, (err: any) => {
        if (err) {
          console.error('Login after registration error:', err);
          return res.status(500).json({ error: 'Error establishing session' });
        }
        const { password, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
      });
    } else {
      const { password, ...userWithoutPassword } = user;
      return res.status(201).json(userWithoutPassword);
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}