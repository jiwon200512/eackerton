import { config } from "dotenv";
import type { Config } from "drizzle-kit";

// Next.js auto-loads .env.local, but drizzle-kit (a separate CLI) only
// reads .env by default - load .env.local explicitly so `db:generate`/
// `db:migrate` see the same TURSO_* values the app uses.
config({ path: ".env.local" });

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || "file:./data/app.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
