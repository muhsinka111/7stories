import { cookies } from "next/headers";

export const SESSION_COOKIE = "sb_session";

/** Read the session access token from the request cookie. */
export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

/** Set the session cookie (httpOnly). */
export async function setSessionCookie(token: string, maxAgeSec = 60 * 60 * 24 * 30) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSec,
  });
}

/** Clear the session cookie. */
export async function clearSessionCookie() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}
