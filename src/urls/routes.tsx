import { db } from "@/config/db/index.js";
import { type NewShortUrl, shortUrls } from "@/config/db/schema.js";
import { Page404 } from "@/templates/404.js";
import {
  generateShortCode,
  validateShortCode,
} from "@/urls/utils/createShortCode.js";
import { html } from "@elysiajs/html";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

export const urlsRouter = new Elysia()
  .use(html())
  .get(
    "/:shortCode",
    async ({ set, params: { shortCode }, html }) => {
      if (shortCode.includes("+")) {
        set.redirect = `${Bun.env.FRONTEND_URL}/${shortCode}`;
        return;
      }

      shortCode.replace("+", "");

      try {
        const shortUrlRecord = await db
          .select({ originalUrl: shortUrls.originalUrl })
          .from(shortUrls)
          .where(eq(shortUrls.shortCode, shortCode))
          .limit(1);

        if (shortUrlRecord.length === 0) return html(<Page404 />);

        set.redirect = shortUrlRecord[0].originalUrl;
      } catch (error) {
        throw new Error("Something went wrong");
      }
    },
    {
      beforeHandle: ({ params: { shortCode }, html }) => {
        if (!validateShortCode(shortCode, true)) return html(<Page404 />);
      },
    }
  )
  .group("/urls", (app) =>
    app
      .post(
        "/",
        async ({ body: { originalUrl } }) => {
          const shortCode = generateShortCode();
          const createdAt = new Date().toISOString();

          const newShortUrlRecord: NewShortUrl = {
            shortCode,
            originalUrl,
            createdAt,
          };

          try {
            await db.insert(shortUrls).values(newShortUrlRecord);

            const shortUrl = `${Bun.env.BACKEND_URL}/${shortCode}`;

            const response = {
              shortUrl,
              originalUrl,
              createdAt,
            };

            return response;
          } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
          }
        },
        { body: t.Object({ originalUrl: t.String() }) }
      )
      .get(
        "/:shortCode",
        async ({ params: { shortCode } }) => {
          try {
            const shortUrlRecord = await db
              .select({
                shortCode: shortUrls.shortCode,
                originalUrl: shortUrls.originalUrl,
                createdAt: shortUrls.createdAt,
              })
              .from(shortUrls)
              .where(eq(shortUrls.shortCode, shortCode))
              .limit(1);

            if (shortUrlRecord.length === 0)
              throw new Error("Short URL not found");

            const shortUrl = `${Bun.env.BACKEND_URL}/${shortCode}`;

            const response = {
              shortUrl,
              originalUrl: shortUrlRecord[0].originalUrl,
              createdAt: shortUrlRecord[0].createdAt,
            };

            return response;
          } catch (error) {
            throw new Error("Something went wrong");
          }
        },
        {
          beforeHandle: ({ set, params: { shortCode } }) => {
            if (!validateShortCode(shortCode)) {
              set.status = 404;
              throw new Error("Invalid short code");
            }
          },
        }
      )
  );
