import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

// Auto-migrate on startup if migrations exist
export async function initializeDatabase() {
  try {
    await migrate(db, { migrationsFolder: "./migrations" });
  } catch (error) {
    // If migrations folder doesn't exist (normal in dev), that's ok
    console.log("Database initialization: no migrations folder found");
  }
}
