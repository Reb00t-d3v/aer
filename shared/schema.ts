import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  freeTrialUsed: boolean("free_trial_used").default(false).notNull(),
  processingCount: integer("processing_count").default(0).notNull(),
  subscriptionPlan: text("subscription_plan").default("free").notNull(),
});

export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  originalUrl: text("original_url").notNull(),
  processedUrl: text("processed_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  
  password: true,
  email: true,
}).extend({
  processingCount: z.number().default(0), 
});

export const insertImageSchema = createInsertSchema(images).pick({
  userId: true,
  originalUrl: true,
  processedUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;
export type Image = typeof images.$inferSelect;
