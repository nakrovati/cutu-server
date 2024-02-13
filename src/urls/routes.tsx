import { Page404 } from "@/templates/404.js";
import { isValidShortCode } from "@/urls/utils/createShortCode.js";
import { html } from "@elysiajs/html";
import { Elysia, t } from "elysia";
import {
  createShortenedUrl,
  getOriginalUrl,
  getShortenedUrl,
} from "./services.js";

const { FRONTEND_URL } = Bun.env;

export const urlsRouter = new Elysia()
  .use(html())
  .get(
    "/:shortCode",
    async ({ set, params: { shortCode }, html }) => {
      if (shortCode.includes("+")) {
        set.redirect = `${FRONTEND_URL}/${shortCode}`;
        return;
      }

      shortCode = shortCode.replace("+", "");

      try {
        const originalUrl = await getOriginalUrl(shortCode);

        if (!originalUrl) return html(<Page404 />);

        set.redirect = originalUrl;
      } catch (error) {
        throw new Error("Something went wrong");
      }
    },
    {
      beforeHandle: ({ params: { shortCode }, html }) => {
        if (!isValidShortCode(shortCode, true)) return html(<Page404 />);
      },
    },
  )
  .group("/urls", (app) =>
    app
      .get(
        "/:shortCode",
        async ({ set, params: { shortCode } }) => {
          try {
            const shortenedUrl = await getShortenedUrl(shortCode);

            if (!shortenedUrl) {
              set.status = 404;
              return new Error("Shortened url not found");
            }

            return shortenedUrl;
          } catch (error) {
            throw new Error("Something went wrong");
          }
        },
        {
          beforeHandle: ({ set, params: { shortCode } }) => {
            if (!isValidShortCode(shortCode)) {
              throw new Error("Invalid short code");
            }
          },
        },
      )
      .post(
        "/",
        async ({ body: { originalUrl } }) => {
          try {
            const response = await createShortenedUrl(originalUrl);
            return response;
          } catch (error) {
            throw new Error("Something went wrong");
          }
        },
        { body: t.Object({ originalUrl: t.String() }) },
      ),
  );
