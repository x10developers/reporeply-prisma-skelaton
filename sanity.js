import "dotenv/config"; 
import { PrismaClient } from "./generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const tables = await prisma.$queryRaw`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
  `;
  console.log(tables);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
