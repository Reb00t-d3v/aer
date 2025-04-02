import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use RAILWAY_DATABASE_URL if available, otherwise fall back to DATABASE_URL
const dbConnectionString = process.env.RAILWAY_DATABASE_URL 

if (!dbConnectionString) {
  throw new Error(
    "No database connection string found. Set either RAILWAY_DATABASE_URL or DATABASE_URL."
  );
}

export const pool = new Pool({ connectionString: dbConnectionString });
export const db = drizzle({ client: pool, schema });
