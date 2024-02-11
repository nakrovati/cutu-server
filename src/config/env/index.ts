import { Output, object, parse, string } from "valibot";

const EnvSchema = object({
  BACKEND_URL: string("BACKEND_URL must be set"),
  FRONTEND_URL: string("FRONTEND_URL must be set"),
  DATABASE_URL: string("DATABASE_URL must be set"),
  DATABASE_AUTH_TOKEN: string("DATABASE_AUTH_TOKEN must be set"),
});

parse(EnvSchema, process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Output<typeof EnvSchema> {}
  }
}
