import { env } from "cloudflare:workers";

export type PrivateAccessKey = "BASE_EXPORT_KEY" | "BASE_COACH_KEY";

export const getPrivateAccessSecret = (key: PrivateAccessKey) =>
  (env as unknown as Record<string, string | undefined>)[key]?.trim() ?? "";

const secureEqual = (left: string, right: string) => {
  const encoder = new TextEncoder();
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let difference = leftBytes.length ^ rightBytes.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }
  return difference === 0;
};

export const hasPrivateAccess = (request: Request, key: PrivateAccessKey) => {
  const expected = getPrivateAccessSecret(key);
  const authorization = request.headers.get("authorization") ?? "";
  return expected.length >= 24 && secureEqual(authorization, `Bearer ${expected}`);
};
