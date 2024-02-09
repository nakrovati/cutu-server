import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { object, parse, string } from "valibot";

const EnvSchema = object({
  DATABASE_URL: string("DATABASE_URL must be set"),
  DATABASE_AUTH_TOKEN: string("DATABASE_AUTH_TOKEN must be set"),
});

const envData = parse(EnvSchema, Bun.env);

const client = createClient({
  url: envData.DATABASE_URL,
  authToken: envData.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client);
