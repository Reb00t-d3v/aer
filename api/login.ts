import { VercelResponse } from '@vercel/node';
import passport from 'passport';
import express from 'express';
import { json } from 'body-parser';
import { AuthenticatedRequest } from './types';

const app = express();
app.use(json());

export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return new Promise<void>((resolve) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
        return resolve();
      }
      
      if (!user) {
        res.status(401).json({ error: info?.message || 'Invalid credentials' });
        return resolve();
      }
      
      if (req.login) {
        req.login(user, (loginErr: any) => {
          if (loginErr) {
            console.error('Login session error:', loginErr);
            res.status(500).json({ error: 'Error establishing session' });
            return resolve();
          }
          
          // Don't send password back to client
          const { password, ...userWithoutPassword } = user;
          
          res.status(200).json(userWithoutPassword);
          resolve();
        });
      } else {
        // If login function isn't available, just return the user
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
        resolve();
      }
    })(req, res);
  });
}