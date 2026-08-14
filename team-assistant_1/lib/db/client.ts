import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Keep a single libsql connection across hot-reloads in dev.
declare global {
  var __turso: ReturnType<typeof createClient> | undefined;
}

// Defaults to a local libSQL file so `npm run dev` and tests work without a
// Turso account. Point TURSO_DATABASE_URL at a libsql://... URL (with
// TURSO_AUTH_TOKEN) to use a hosted Turso database instead.
const url = process.env.TURSO_DATABASE_URL || "file:./data/app.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

function createConnection() {
  if (url.startsWith("file:")) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("fs").mkdirSync(require("path").dirname(url.slice("file:".length)), {
      recursive: true,
    });
  }
  const c = createClient({ url, authToken });
  c.execute("PRAGMA foreign_keys = ON").catch(() => {});
  return c;
}

const client = global.__turso ?? createConnection();
if (process.env.NODE_ENV !== "production") {
  global.__turso = client;
}

export const db = drizzle(client, { schema });
export { client };
