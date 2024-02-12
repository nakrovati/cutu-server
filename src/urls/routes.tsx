import { db } from "@/config/db/index.js";
import { type NewShortenedUrl, shortenedUrls } from "@/config/db/schema.js";
import { Page404 } from "@/templates/404.js";
import {
  generateShortCode,
  validateShortCode,
} from "@/urls/utils/createShortCode.js";
import { html } from "@elysiajs/html";
import { eq, sql } from "drizzle-orm";
import { Elysia, t } from "elysia";

const { BACKEND_URL, FRONTEND_URL } = Bun.env;

const preparedFindOriginUrlByShortCode = db
  .select({ originalUrl: shortenedUrls.originalUrl })
  .from(shortenedUrls)
  .where(eq(shortenedUrls.shortCode, sql.placeholder("shortCode")))
  .limit(1)
  .prepare();

const preparedFindShortenedUrlByShortCode = db
  .select({
    shortCode: shortenedUrls.shortCode,
    originalUrl: shortenedUrls.originalUrl,
    createdAt: shortenedUrls.createdAt,
  })
  .from(shortenedUrls)
  .where(eq(shortenedUrls.shortCode, sql.placeholder("shortCode")))
  .limit(1)
  .prepare();

const preparedInsertShortenedUrl = db
  .insert(shortenedUrls)
  .values({
    shortCode: sql.placeholder("shortCode"),
    originalUrl: sql.placeholder("originalUrl"),
    createdAt: sql.placeholder("createdAt"),
  })
  .prepare();

export const urlsRouter = new Elysia()
  .use(html())
  .get(
    "/:shortCode",
    async ({ set, params: { shortCode }, html }) => {
      if (shortCode.includes("+")) {
        set.redirect = `${FRONTEND_URL}/${shortCode}`;
        return;
      }

      shortCode.replace("+", "");

      try {
        const shortenedUrl = await preparedFindOriginUrlByShortCode.execute({
          shortCode,
        });

        if (shortenedUrl.length === 0) return html(<Page404 />);

        set.redirect = shortenedUrl[0].originalUrl;
      } catch (error) {
        throw new Error("Something went wrong");
      }
    },
    {
      beforeHandle: ({ params: { shortCode }, html }) => {
        if (!validateShortCode(shortCode, true)) return html(<Page404 />);
      },
    },
  )
  .group("/urls", (app) =>
    app
      .post(
        "/",
        async ({ body: { originalUrl } }) => {
          const shortCode = generateShortCode();
          const createdAt = new Date().toISOString();

          const newShortenedUrl: NewShortenedUrl = {
            shortCode,
            originalUrl,
            createdAt,
          };

          try {
            await preparedInsertShortenedUrl.execute(newShortenedUrl);

            const shortUrl = `${BACKEND_URL}/${shortCode}`;

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
        { body: t.Object({ originalUrl: t.String() }) },
      )
      .get(
        "/:shortCode",
        async ({ params: { shortCode } }) => {
          try {
            const shortenedUrl =
              await preparedFindShortenedUrlByShortCode.execute({ shortCode });

            if (shortenedUrl.length === 0)
              throw new Error("Short URL not found");

            const shortUrl = `${BACKEND_URL}/${shortCode}`;

            const response = {
              shortUrl,
              originalUrl: shortenedUrl[0].originalUrl,
              createdAt: shortenedUrl[0].createdAt,
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
        },
      ),
  );
