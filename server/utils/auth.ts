import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { User } from "@shared/schema";

export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session && req.session.userId) {
    return next();
  }
  
  res.status(401).json({ message: "Authentication required" });
}

export function getUserFromSession(
  req: Request
): Promise<User | undefined> {
  if (req.session && req.session.userId) {
    return storage.getUser(req.session.userId);
  }
  return Promise.resolve(undefined);
}

// For checking if a user has used their free trial
export async function checkFreeTrialUsage(
  req: Request
): Promise<boolean> {
  // Check if user is logged in
  if (req.session && req.session.userId) {
    const user = await storage.getUser(req.session.userId);
    return user ? user.freeTrialUsed : true;
  }
  
  // For anonymous users, check the IP-based counter
  // In this implementation, we use a global counter for simplicity
  // In a real app, you might use IP tracking or cookies
  const trialCount = await storage.getAnonymousTrialCount();
  return trialCount > 0;
}

// Mark a user's free trial as used
export async function markFreeTrialAsUsed(
  req: Request
): Promise<void> {
  // If user is logged in, update their record
  if (req.session && req.session.userId) {
    await storage.updateUserFreeTrialStatus(req.session.userId, true);
    return;
  }
  
  // For anonymous users, increment the global counter
  await storage.incrementAnonymousTrialCount();
}
