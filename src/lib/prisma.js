import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Force chaque nouvelle connexion du pool à raisonner en UTC
pool.on('connect', (client) => {
  client.query('SET timezone = "UTC"');
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });