import { type NewShortenedUrl } from "@/config/db/schema.js";
import {
  findOriginUrlByShortCode,
  findShortenedUrlByShortCode,
  insertShortenedUrl,
} from "./repository.js";
import { generateShortCode } from "./utils/createShortCode.js";

const { BACKEND_URL } = Bun.env;

export async function getShortenedUrl(shortCode: string) {
  const shortenedUrl = await findShortenedUrlByShortCode.execute({
    shortCode,
  });

  if (shortenedUrl.length === 0) return undefined;

  const shortUrl = `${BACKEND_URL}/${shortCode}`;

  return {
    shortUrl,
    originalUrl: shortenedUrl[0].originalUrl,
    createdAt: shortenedUrl[0].createdAt,
  };
}

export async function getOriginalUrl(shortCode: string) {
  const shortenedUrl = await findOriginUrlByShortCode.execute({
    shortCode,
  });

  if (shortenedUrl.length === 0) return undefined;

  return shortenedUrl[0].originalUrl;
}

export async function createShortenedUrl(originalUrl: string) {
  const shortCode = generateShortCode();
  const createdAt = new Date().toISOString();

  const newShortenedUrl: NewShortenedUrl = {
    shortCode,
    originalUrl,
    createdAt,
  };

  await insertShortenedUrl.execute(newShortenedUrl);

  const shortUrl = `${BACKEND_URL}/${shortCode}`;

  return { shortUrl, originalUrl, createdAt };
}
