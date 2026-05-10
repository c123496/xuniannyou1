import nextEnv from "@next/env";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;
const { loadEnvConfig } = nextEnv;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

loadEnvConfig(root);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not configured");
}

const migrationsDir = path.join(root, "src", "lib", "db", "migrations");
const files = (await readdir(migrationsDir)).filter((file) => file.endsWith(".sql")).sort();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("sslmode=require")
    ? {
        rejectUnauthorized: false,
      }
    : undefined,
});

try {
  for (const file of files) {
    const sql = await readFile(path.join(migrationsDir, file), "utf8");
    await pool.query(sql);
    console.log(`applied ${file}`);
  }
} finally {
  await pool.end();
}
