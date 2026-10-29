import { createHash } from "node:crypto";
import { headers } from "next/headers";

export const hashValue = (v: string) => createHash("sha256").update(v).digest("hex").slice(0, 32);

/** Hash do IP (o IP em claro nunca é armazenado). */
export async function clientKey(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return hashValue(ip);
}
