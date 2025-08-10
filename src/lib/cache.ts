import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// In-memory fallback cache when DB is not available in dev
const memoryCache = new Map<string, { payload: unknown; expiresAt: number }>();

function isDbConfigured(): boolean {
  const url = process.env.DATABASE_URL || "";
  return Boolean(url) && !url.includes("user:password");
}

export async function getCached<T = unknown>(key: string): Promise<T | null> {
  if (!isDbConfigured()) {
    const entry = memoryCache.get(key);
    if (!entry) return null;
    if (entry.expiresAt < Date.now()) return null;
    return entry.payload as T;
  }
  try {
    const record = await prisma.apiCache.findUnique({ where: { key } });
    if (!record) return null;
    if (record.expiresAt.getTime() < Date.now()) return null;
    return record.payload as T;
  } catch {
    const entry = memoryCache.get(key);
    if (!entry) return null;
    if (entry.expiresAt < Date.now()) return null;
    return entry.payload as T;
  }
}

export async function setCached<T = unknown>(key: string, payload: T, ttlMs: number = ONE_DAY_MS) {
  const expiresAt = Date.now() + ttlMs;
  if (!isDbConfigured()) {
    memoryCache.set(key, { payload, expiresAt });
    return;
  }
  try {
    await prisma.apiCache.upsert({
      where: { key },
      create: { key, payload: JSON.parse(JSON.stringify(payload)), expiresAt: new Date(expiresAt) },
      update: { payload: JSON.parse(JSON.stringify(payload)), expiresAt: new Date(expiresAt) },
    });
  } catch {
    memoryCache.set(key, { payload, expiresAt });
  }
}


