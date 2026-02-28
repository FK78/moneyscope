import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Debug: log connection target (not password) to help diagnose production issues
if (process.env.NODE_ENV === 'production') {
  try {
    const u = new URL(process.env.DATABASE_URL);
    const pw = decodeURIComponent(u.password);
    console.log(`[db] Connecting to ${u.hostname}:${u.port} as ${u.username} (db: ${u.pathname})`);
    console.log(`[db] Password length: ${pw.length}, first: "${pw[0]}", last: "${pw[pw.length - 1]}", raw URL password: "${u.password}" (len ${u.password.length})`);
  } catch {
    console.error('[db] DATABASE_URL is not a valid URL');
  }
}

const globalForDb = globalThis as unknown as { pgClient: ReturnType<typeof postgres> };

const client = globalForDb.pgClient ?? postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false },
});

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pgClient = client;
}

export const db = drizzle(client);