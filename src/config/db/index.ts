import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
  url: Bun.env.DATABASE_URL,
  authToken: Bun.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client);
