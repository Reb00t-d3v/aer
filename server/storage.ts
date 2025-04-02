import { users, type User, type InsertUser, images, type Image, type InsertImage } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { pool } from "./db";
import { isVercel } from "./is-vercel";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  markFreeTrialUsed(userId: number): Promise<void>;
  incrementProcessingCount(userId: number): Promise<void>;
  
  saveImage(image: InsertImage): Promise<Image>;
  getUserImages(userId: number): Promise<Image[]>;
  getImage(id: number): Promise<Image | undefined>;
  
  sessionStore: any; // Using any type here to avoid SessionStore type issues
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private images: Map<number, Image>;
  sessionStore: any; // Using any type here to avoid SessionStore type issues
  currentUserId: number;
  currentImageId: number;

  constructor() {
    this.users = new Map();
    this.images = new Map();
    this.currentUserId = 1;
    this.currentImageId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    // Make sure email is null if not provided to match the schema
    const user: User = { 
      ...insertUser, 
      id, 
      email: insertUser.email || null,
      freeTrialUsed: false, 
      processingCount: 0, 
      subscriptionPlan: "free" 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async markFreeTrialUsed(userId: number): Promise<void> {
    const user = await this.getUser(userId);
    if (user) {
      user.freeTrialUsed = true;
      this.users.set(userId, user);
    }
  }

  async incrementProcessingCount(userId: number): Promise<void> {
    const user = await this.getUser(userId);
    if (user) {
      user.processingCount += 1;
      this.users.set(userId, user);
    }
  }

  async saveImage(image: InsertImage): Promise<Image> {
    const id = this.currentImageId++;
    // Ensure userId is null if not provided
    const newImage: Image = {
      id,
      userId: image.userId || null,
      originalUrl: image.originalUrl,
      processedUrl: image.processedUrl,
      createdAt: new Date(),
    };
    this.images.set(id, newImage);
    return newImage;
  }

  async getUserImages(userId: number): Promise<Image[]> {
    return Array.from(this.images.values())
      .filter(image => image.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getImage(id: number): Promise<Image | undefined> {
    return this.images.get(id);
  }
}

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any type here to avoid SessionStore type issues

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        email: insertUser.email || null,
        freeTrialUsed: false,
        processingCount: 0,
        subscriptionPlan: "free"
      })
      .returning();
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`);
    }
    
    return updatedUser;
  }

  async markFreeTrialUsed(userId: number): Promise<void> {
    await db
      .update(users)
      .set({ freeTrialUsed: true })
      .where(eq(users.id, userId));
  }

  async incrementProcessingCount(userId: number): Promise<void> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (user) {
      await db
        .update(users)
        .set({ processingCount: user.processingCount + 1 })
        .where(eq(users.id, userId));
    }
  }

  async saveImage(image: InsertImage): Promise<Image> {
    const [savedImage] = await db
      .insert(images)
      .values(image)
      .returning();
    
    return savedImage;
  }

  async getUserImages(userId: number): Promise<Image[]> {
    return await db
      .select()
      .from(images)
      .where(eq(images.userId, userId))
      .orderBy(desc(images.createdAt));
  }

  async getImage(id: number): Promise<Image | undefined> {
    const [image] = await db.select().from(images).where(eq(images.id, id));
    return image || undefined;
  }
}

// Choose storage implementation based on environment
export const storage = isVercel() || process.env.USE_DATABASE === "true" 
  ? new DatabaseStorage() 
  : new MemStorage();
