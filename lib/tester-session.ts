import { cookies } from "next/headers";

export const testerCookieName = "base_tester_id";
export const testerIdPattern = /^[A-Za-z0-9ÆØÅæøå-]{2,12}$/;

export function normalizeTesterId(value: unknown) {
  const testerId = typeof value === "string" ? value.trim().toUpperCase() : "";
  return testerIdPattern.test(testerId) ? testerId : null;
}

export async function getTesterId() {
  const store = await cookies();
  return normalizeTesterId(store.get(testerCookieName)?.value);
}

export async function setTesterId(testerId: string) {
  const store = await cookies();
  store.set(testerCookieName, testerId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 21,
  });
}

export async function clearTesterId() {
  const store = await cookies();
  store.delete(testerCookieName);
}
