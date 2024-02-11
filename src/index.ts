import "@/config/env";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import { urlsRouter } from "./urls/routes.js";

const { FRONTEND_URL } = Bun.env;

const app = new Elysia()
  .use(html())
  .use(staticPlugin())
  .use(urlsRouter)
  .get("/", ({ set }) => {
    set.redirect = FRONTEND_URL;
  })
  .listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
