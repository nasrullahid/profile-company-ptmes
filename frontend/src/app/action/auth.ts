"use server";
console.log("Auth Action Loaded - Version: 2026-03-05 12:08");
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/jwt";
import { setAuthCookie } from "@/lib/cookies";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteAuthCookie } from "@/lib/cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

//REGISTER
export async function register(form: FormData) {
  const name = form.get("name") as string;
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  if (!name || !email || !password) {
    revalidatePath("/register");
    return {
      error: "Semua field harus diisi",
    };
  }
  
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.errors?.email) {
        return { error: "Email sudah terdaftar" };
      }
      return { error: data.message || "Gagal mendaftar" };
    }

    // Embed Sanctum token in our original local JWT format
    const token = await createToken({ email, sanctumToken: data.token });
    await setAuthCookie(token);
    revalidatePath("/register");
  } catch (error) {
    console.error("Register error:", error);
    return { error: "[Register Error] Terjadi kesalahan saat pendaftaran atau koneksi database gagal" };
  }
}

//L0GIN
export async function login(form: FormData) {
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  if (!email || !password) {
    revalidatePath("/login");
    return {
      error: "semua field harus di isi",
    };
  }
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || data.message || "Email atau password salah" };
    }

    // Embed Sanctum token in our original local JWT format
    const token = await createToken({ email, sanctumToken: data.token });
    await setAuthCookie(token);
    revalidatePath("/admin");
  } catch (error: any) {
    console.error("Login error:", error);
    const msg = error?.message || error?.code || String(error);
    return { error: `[API Error] ${msg.substring(0, 150)}` };
  }
  redirect("/admin");
}

//LOGOUT
export async function logout() {
  await deleteAuthCookie();
  redirect("/");
}

