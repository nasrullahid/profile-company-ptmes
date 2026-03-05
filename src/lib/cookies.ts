import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const COOKIE_NAME = "auth_token";
export async function setAuthCookie(token: any) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });
}

export async function getAuthCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME);
  return token?.value || null;
}

export async function deleteAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
