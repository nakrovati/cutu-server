import { db } from "@/config/db/index.js";
import { shortenedUrls } from "@/config/db/schema.js";
import { eq, sql } from "drizzle-orm";

export const findOriginUrlByShortCode = db
  .select({ originalUrl: shortenedUrls.originalUrl })
  .from(shortenedUrls)
  .where(eq(shortenedUrls.shortCode, sql.placeholder("shortCode")))
  .limit(1)
  .prepare();

export const findShortenedUrlByShortCode = db
  .select({
    shortCode: shortenedUrls.shortCode,
    originalUrl: shortenedUrls.originalUrl,
    createdAt: shortenedUrls.createdAt,
  })
  .from(shortenedUrls)
  .where(eq(shortenedUrls.shortCode, sql.placeholder("shortCode")))
  .limit(1)
  .prepare();

export const insertShortenedUrl = db
  .insert(shortenedUrls)
  .values({
    shortCode: sql.placeholder("shortCode"),
    originalUrl: sql.placeholder("originalUrl"),
    createdAt: sql.placeholder("createdAt"),
  })
  .prepare();
