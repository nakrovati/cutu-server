import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const shortenedUrls = sqliteTable("shortened_urls", {
  id: integer("id").primaryKey(),
  shortCode: text("short_code").notNull().primaryKey(),
  originalUrl: text("original_url").notNull(),
  createdAt: text("created_at").notNull(),
});

export type NewShortUrl = typeof shortenedUrls.$inferInsert;
