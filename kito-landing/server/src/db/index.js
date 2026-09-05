import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';
import 'dotenv/config';

// Menggunakan koneksi PostgreSQL dari environment variable
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Inisialisasi drizzle instance
export const db = drizzle(pool, { schema });
