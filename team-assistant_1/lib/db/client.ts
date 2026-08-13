import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import * as schema from "./schema";

// Keep a single sqlite connection across hot-reloads in dev.
declare global {
  var __sqlite: Database.Database | undefined;
}

const dbPath =
  process.env.DATABASE_PATH || path.join(process.cwd(), "data", "app.db");

function createConnection() {
  const dir = path.dirname(dbPath);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("fs").mkdirSync(dir, { recursive: true });
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  return sqlite;
}

const sqlite = global.__sqlite ?? createConnection();
if (process.env.NODE_ENV !== "production") {
  global.__sqlite = sqlite;
}

export const db = drizzle(sqlite, { schema });
export { sqlite };
